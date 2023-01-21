# Shader_CG
Shader Assignment for the ComputerGraphics Course at the DHBW

# Solar System Shader
A collaborative Work by: [Tom Hofer](https://github.com/Tom5H), [Samuel Lang](https://github.com/Zuzuztut), [Maurice Tonn](https://github.com/mauricetonn) and me

# Table of Contents
- [Shader\_CG](#shader_cg)
- [Solar System Shader](#solar-system-shader)
- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Methods](#methods)
  - [OpenGL](#opengl)
  - [Fragment Shader](#fragment-shader)
- [Implemented Model](#implemented-model)
  - [The Solar System as Model](#the-solar-system-as-model)
  - [Theoretical Basis](#theoretical-basis)
  - [Algorithmical Implementation](#algorithmical-implementation)
- [Citations](#citations)

# Introduction
The exam paper for the lecture Computer Graphics, consists of a fragment shader as well as a
ray tracer, since the documentation of the ray tracer is in another document it is neglected
here.

A 2-dimensional solar system was chosen as the object to be represented, which was
implemented in a fragment shader. The solar system is universally known and thus serves as a
simple reference and orientation aid for the scope to be implemented. The entire solar system
was programmed in a fragment shader and can be viewed using the "glsl Canvas" extension in
Visual Studio Code.

# Methods
The following chapter presents a brief outline of OpenGL and fragment shaders.

## OpenGL
OpenGL (Open Graphics Library) is an open programming standard, which is operated by the
Khronos Group. OpenGL provides the user with a variety of rendering functions for creating
and manipulating 2D and 3D images. OpenGL is based on the concept of a graphics pipeline
in which a scene is transformed, lit and rendered through a series of programmable stages
called shaders. OpenGL is independent of a programming language, for programming shaders
with OpenGL the OpenGL Shading Language was specified by Khronos whose syntax
resembles that of C. [1]

## Fragment Shader
The significance of the fragment shader is easily underestimated because only with a fragment
shader can colors and shapes be rendered on the screen. The fragment shader is the link in the
rendering pipeline that is responsible for the color of the pixel, the texture mapping and the
position in space. The fragment shader is a programmable function block introduced in
OpenGL version 2.0 along with the vertex shader. [1][2] The Fragment Shader determines the
RGBA output for a pixel. Each pixel is calculated once, but as soon as several overlapping
objects have to be calculated it is necessary to perform code optimization. A pixel or
"fragment" is a data structure that contains all the information needed to represent a pixel on
the screen. The performance of the fragment shader has a direct impact on how fast the image
can be rendered. [2] [3]

# Implemented Model
In the first part, the underlying model of the solar system is explained. This includes the scope
of the system, assumptions, as well as simplifications that have been made to guarantee the
feasibility of the model as a GLSL shader.
In the second part of this chapter the theoretical basics of the chosen model are presented.
This includes preferably considerations about the conversion of the orbits of moons and
planets, as well as the background.
The third part shows how the considerations from the previous part were implemented
algorithmically.

## The Solar System as Model
In our model we want to limit ourselves to a few objects. Besides the sun as the center of our
model, according to the heliocentric world view, all planets orbiting the sun are included. That
means Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune are modeled. The
attentive reader will notice that the dwarf planets Ceres, Pluto, Haumea, Makemake and Eris
have no place in this model. They are too far out of Neptune's orbit and too small to be
meaningfully represented. [4]

Even if the dwarf planets have no place in our model, the most important moons of the planets
are placed on their orbits. Additionally, only the most important or largest moons are
considered here as well. For this purpose, up to 4 moons were selected for each planet. [5]

Now to a difficult topic, the scale. If you look at the scale relations between the sun and
planets like Mercury, it becomes clear that a true-to-scale representation of sun and planets is
not possible. The same is true for the orbits of the planets.

Thus the size of the sun was fixed with a value and the size of the planets is oriented to it in
percent. The radius of the largest planet (Jupiter) is set to 50% of the radius of the sun. This
ensures a good visibility of the planets. Since also the size of the moons cannot be represented
true to scale, the radius of the smallest moons is set to 1% of the radius of the sun. The other
moons are correspondingly larger.

The radii of the orbits have been determined relative to the radius of Neptune's orbit. In this
model the orbits are represented as circular orbits and not as elliptical orbits. The deviation
from a circular orbit is difficult to see in the implemented model and scale anyway. [6]

The colors of the individual planets and moons are matched approximately to the color of the
actual fully illuminated planets and moons. [7]

The orbital velocity is determined based on the actual velocities relative to Mercury (fastest
planet). The orbital velocity of the moons is determined relative to the orbital velocity of the
Earth's moon. The speed of the moon is determined by the orbital speed of the earth around
the sun, so that about 12 orbits of the moon around the earth are reached per orbit of the earth
around the sun.

To make the background look appealing, about 200 stars (experience values) are displayed.
They are placed randomly and do not correspond to reality.

## Theoretical Basis
In this subchapter, the theoretical foundations of the implemented model are explained.

The sun represents the center of the system. It is therefore a good idea to place it in the center
of the image.

**Planetary orbit**\
To represent a circular path, a combination of sine and cosine is suitable. As already
mentioned, the sun represents the center.

![Figure 1: Unit circle with sine and cosine [8]](unbekannt.png "Circle")

For this purpose, depending on the time, the y coordinate is determined with the help of the
sine and the x coordinate with the help of the cosine, so that a unit circle is created. The planet
is at each time the point $P(sin(a) | cos(a))$.

The velocity can be influenced by a factor within the trigonometric functions. So that, with
the velocity factor s, the coordinates can be determined with $P(sin(s * a) | cos(s * a))$.

The radius of the circular path is normalized to 1 for the unit circle. If one wants to modify
this, the coordinates can be multiplied by a distance factor e. This results in $P(e * sin(s * a) | e * cos(s * a))$ for the point. It is to be noted that for different factors *e_1* and *e_2* no circular
path is modeled, but an elliptical path.

**Lunar orbit**\
In contrast to the planetary orbit, the sun is not the center of rotation for the moons of the
planets. This is to be found for each moon in the center of the respective planet. This can be
determined with the help of the equation for the planetary orbit depending on the time.

**Comet orbit**\
In addition to the planets and moons, another celestial body is said to orbit the sun. It is a
comet, which should move on an elliptical orbit around the sun. For this the equation for the
orbit is adapted in such a way that *e_1* and *e_2* are not equal. In addition, an offset in y
direction is inserted so that the comet crosses the image only once per orbit.

**Representation of moon and planets**\
The planets and moons are displayed as symmetrical circles. For this purpose, a function is
implemented that receives as input the parameters of the celestial body and then calculates the
position of the circle and then draws it with a given color on the displayed image.

**Representation of the orbit**\
The orbit of the planets is represented wherever the planet is not currently located. For this
purpose, a combination of sine and cosine, as explained above, is used again.

**Representation of the comet**\ 
The comet should consist of a main body and a tail. The tail is modeled as a series of circles.
For each circle the position of the main body at an already passed time is calculated and
displayed smaller depending on the distance from the main body. This has the effect that with
increasing speed of the comet the length of the tail grows.

**Representation of the stars**\
Both fixed stars and animated stars should be displayed.
To display the fixed stars, 150 pairs of coordinates are determined randomly so that they
appear on the screen approximately equally distributed. They are then displayed as very small
dots.
Furthermore, animated stars are to be displayed. For this purpose, the position of each star is
determined randomly, depending on the time, and a blinking is implemented in two different
variants.
It should be noted that a star may only be represented where it does not overlap with a planet,
moon, sun or orbit. For this purpose, the position of the stars is simply compared with the
position of these bodies.

**Bonus: Representation of Pacman**
As a playable element in the final system, Pacman from the video game series of the same
name is brought into the solar system. He moves in the same orbit as Neptune and pursues it
at 1.1 times the speed. Upon reaching Neptune, it is supposed to fade out briefly, which
represents "eating" the planet. After Pacman passes Neptune, it reappears and the chase
begins again.
Pacman himself is represented as a yellow circle. He gets the typical mouth by inserting an
animated circle section.

## Algorithmical Implementation
In this chapter, the algorithmic implementation of the theoretical principles introduced in the
previous chapter is explained using individual examples.

**The selected coordinate system**\
![Figure 2: Shader and coordinate system [8]](Images/unbekannt1.png "shaderAndCoord")


As you can see in the figure, the sun has been chosen as the center of the system according to
chapter 3.1 and 3.2. In order for the coordinate system of the shader to match the model of the
solar system, the reference point of the model must be shifted. By default, the origin of the x
and y axis is at (0.0|0.0) and is represented by gl_FragCoord. The point (0.0|0.0) is normally
located in the upper right corner of the displayed image. However, we need to move it to the
center which can be done with

![Figure 3: Coordinates](Images/unbekannt2.png "Coord")


is realized. "position" now represents our new origin.

To implement some further functionalities, which will be explained later, the x coordinate of
the mouse position is also required. This is defined with

![Figure 4: Mouse position](Images/unbekannt3.png "mousePos")

determined.

In addition to u_resolution and u_mouse for the size of the current image and the mouse
position, other uniform variables are used. A uniform variable is a variable that is identical for
all threads. Another uniform variable is u_time, which contains the time in seconds after the
start of the animation.

**Predefined sizes**\
Some data were defined globally outside the functions. This includes Pi as a constant, which
is needed for the calculation of the circle section. Vectors for the colors of the sun, planets,
moons and stars. Floating point numbers for the radius of the planets and moons, as well as
their orbits. Also the speed of the planets is represented as floating point number.

**Planetary orbit**\
For the calculation of the planet orbits, sine and cosine are used, as discussed in chapter 3.2.
In the function calcPositionOfObject() the position of the planet is determined depending on
its parameters:

Distance (radius of the orbit)
Speed (speed of the planet)
Position (shifted origin)
Center (position of the sun in our coordinate system)
mouseX (position of the mouse in x direction)
The latter is used to make the orbital velocity variable. Distance corresponds to the distance
factor e, which has been factored out (since it is the same for sine and cosine). The
combination of Speed and mouseX corresponds to the velocity factor s.

**Lunar orbit**\
The calculation of the moon orbit is done analog to the planet orbit in the function
calcPositionOfObject. The difference is that first the center of the corresponding planet is
calculated with the function calcCenterOfObject(). This center is then used in place of the
position of the sun to represent the center of rotation of the moons.

**Comet orbit**\
Also the calculation of the comet orbit is analogous to the planet orbit. However, in contrast
to the planets, different distance factors were used to create an elliptical orbit.

**Representation of moon and planets**\
To create a colored circle from the position of the sun, planets and moons, the step function is
used first. This function gets the position and the radii of the objects and returns, multiplied
by the corresponding color of the object, the colored circle. For the display all objects are
added and gl_FragColor is passed.

**Representation of the orbits**\
For the representation of the orbits the function createOrbit() is used. This calculates the circle
of the orbit from the distance of the corresponding planet and the position of the shifted
origin. The circle is then generated as a blue line with smoothstep() and also passed to
gl_FragColor.

The position of the planet is subtracted from the position of the orbit so that it is not overlaid
by the blue line.

**Representation of the comet**\

![Figure 5: Representation of the comet](Images/unbekannt4.png "Comet")

In the figure above it can be seen that after the main body (a = 1.0) further points are
generated to create the tail of the comet. For this the step() function is used again.

**Representation of the stars**\
The calculation of the coordinates of the stars is done with the random() function. It
implements a typical approach to generate pseudo-random numbers. These coordinates are
always the same for the fixed stars, because the input for the random() function remains the
same. For the animated stars, u_time is also used to determine the coordinates, so that the
position of the stars changes over time.

![Figure 6: Star animation](Images/unbekannt5.png "starAn")

In the figure above, the animation is implemented. The sine function makes the color of the
stars oscillate between the desired color and black, creating a blinking effect.

**Bonus: Representation of Pacman**\
The determination and position and circle of Pacman happen analogous to the representation
of planets and moons. Pacman is in the orbit of Neptune and is 10% faster than it.
To implement the biting animation, the angle of the circle section is determined with the help
of the arc tangent and the y-coordinate. The direction of the "opening" is determined by the x-
coordinate, so that Pacman opens and closes his mouth once per semi-axis.

# Citations
[1] K. Lehn, M. Gotzes, and F. Klawonn, Fundamentals of computer graphics: an introduction
with OpenGL and Java, Apress, 2019.

[2] J. Rodríguez, GLSL essentials, Birmingham: Packt Publishing, 2013.

[3] K. Halladay, Practical Shader Development: Vertex and Fragment Shaders for Game
Developers}, New York: Apress, 2019.

[4] J. Baker, Astronomy and Cosmology, Heidelberg: Springer, 2012.

[5] Denise, "Astronomy Box," [Online]. Available: https://astrokramkiste.de/monde.
[Accessed 20 01 2023].

[6] A. Without, "goruma," [Online]. Available: https://www.goruma.de/erde-und-
natur/astronomie/erdumlaufbahn-keplersche-gesetze-exzentrizitaet. [Accessed 20 01
2023].

[7] Enrique, "Space Blog," [Online]. Available: https://planetariodevitoria.org/de/espaco/qual-
e-a-cor-dos-planetas.html. [Accessed 20 01 2023].

[8] O. Author, "Matheretter," [Online]. Available:
https://www.matheretter.de/wiki/einheitskreis-sinus-kosinus. [Accessed 20 01 2023].