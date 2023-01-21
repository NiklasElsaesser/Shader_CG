#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_circlePos;

const float PI = 3.1415926535897932384626433832795;

// Define the Colors for the Planets

vec4 colorSun=vec4(1.,.865,.054,1.);
vec4 colorMercury=vec4(.820,.453,.093,1.);
vec4 colorVenus=vec4(1.,.598,.071,1.);
vec4 colorEarth=vec4(.072,.038,1.,1.);
vec4 colorMars=vec4(1.,.416,.114,1.);
vec4 colorJupiter=vec4(1.,.618,.453,1.);
vec4 colorSaturn=vec4(1.,.744,.494,1.);
vec4 colorUranus=vec4(.360,1.,.981,1.);
vec4 colorNeptun=vec4(.149,.198,1.,1.);

bool eatenNeptun = false;

// Define the Colors for the Moons (with actual Names because - why not?)

vec4 colorMoon=vec4(.2706,.2706,.2706,1.);
vec4 colorPhobos=vec4(.9137,.7333,.6157,1.);
vec4 colorDeimos=vec4(.9412,.7804,.5961,1.);
vec4 colorIo=vec4(.9804,.8275,.3765,1.);
vec4 colorEuropa=vec4(.7373,.6706,.6314,1.);
vec4 colorGanymede=vec4(.6784,.6941,.6196,1.);
vec4 colorCallisto=vec4(.4745,.6784,.5804,1.);
vec4 colorMimas=vec4(.2627,.2627,.2627,1.);
vec4 colorEnceladus=vec4(.902,.902,.902,1.);
vec4 colorTethys=vec4(.8314,.8196,.8196,1.);
vec4 colorDione=vec4(.7529,.7529,.7529,1.);
vec4 colorAriel=vec4(.4588,.4588,.4588,1.);
vec4 colorUmbriel=vec4(.3843,.3843,.3843,1.);
vec4 colorTitania=vec4(.7373,.7098,.6627,1.);
vec4 colorOberon=vec4(.7725,.6549,.6549,1.);
vec4 colorTriton=vec4(.5765,.4706,.6745,1.);
vec4 colorNereid=vec4(.6784,.6706,.6706,1.);

// Define 3 different Colors for blinking Stars
vec4 colorStar1=vec4(1.,.865,.054,1.);
vec4 colorStar2=vec4(0.66, 0.67, 0.47, 1.);
vec4 colorStar3=vec4(0.67, 0.47, 0.47, 1.);

// Distances

float distSun=0.;
float distMercury=.15;
float distVenus=.2;
float distEarth=.25;
float distMars=.3;
float distJupiter=.5;
float distSaturn=.6;
float distUranus=.8;
float distNeptun=.95;
float distStar=.4;

// Define Radius Coefficients relative to Sun (biggest)

float coeffSun=1.;
float coeffMercury=.1;
float coeffVenus=.1;
float coeffEarth=.16;
float coeffMars=.1;
float coeffJupiter=.5;
float coeffSaturn=.4;
float coeffUranus=.21;
float coeffNeptun=.2;
float coeffMoon=.13;
float coeffStar=.03;

// Define Planet Speed relative to Mercury (fastest)

float speedMercury=1.;
float speedVenus=.731;
float speedEarth=.622;
float speedMars=.504;
float speedJupiter=.273;
float speedSaturn=.202;
float speedUranus=.142;
float speedNeptun=.114;
float speedStar=.0;

// calculate Planet Position depending on u_time and center
float calcPositionOfObject(float distance,float speed,vec2 position,vec2 center, float mouseX){
    vec2 orbit=vec2(cos(mouseX * u_time*speed),sin(mouseX * u_time*speed))*distance;
    float pos=length(position-center+orbit);
    return pos;
}

float calcPositionOfPacman(float distance,float speed,vec2 position,vec2 center, float mouseX){
    vec2 orbit=vec2(cos(mouseX * (u_time)*speed),sin(mouseX * (u_time)*speed))*-distance;
    float pos=length(position-center+orbit);
    return pos;
}

float calcPositionOfAsteroid(float distance,float speed,vec2 position,vec2 center, float a){
    speed *= .2;
    vec2 orbit=vec2(20. * cos((u_time - a)*speed) -0., 15. * sin((u_time - a)*speed + 1.2)+3.)*distance;
    float pos=length(position-center+orbit);
    return pos;
}

// calculate Star Position depending on u_time and center

// calculate Center of a Planet
vec2 calcCenterOfObject(float distance,float speed,vec2 position,vec2 center, float mouseX){
    vec2 planetCenter=vec2(cos(mouseX * u_time*speed),sin(mouseX * u_time*speed))*distance;
    return planetCenter;
}

// create Circular Orbits
vec3 createOrbit(float distance,vec2 position)
{
    vec3 colorOrbit=vec3(0.,.19,.51);
    return mix(vec3(.0),
    colorOrbit,
    smoothstep(2.5/u_resolution.y,0.,abs(length(position)-(distance))));
}

// Calculate the Speed of the Moons multiplied by a factor of 0.01 to
// make the Orbits visible
// factor means time for a full circulation around the planet in Earth Days
float MoonSpeed(float factor){
    return.01*356./factor*speedEarth;
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(.5 ,78.233)))*
        43758.5453123);
}

float overlap(float circleStar, float circleAll){
    if(circleStar == circleAll){
            return 0.;
        }else{
            return circleStar;
        }
}

// Main Function
void main(){
    // Set Position to the middle of the Screen
    vec2 position=(gl_FragCoord.xy/u_resolution.xy)*2.-1.;
    float mouseX = ((u_mouse.x / u_resolution.x) ) * 10.;
    float mouseY = ((u_mouse.y / u_resolution.y) +1. ) * 1.;
    // description needed
    vec2 centerStar=u_circlePos;
    // description needed
    float animation1=sin(u_time * 6.);
    float animation2=sin(u_time * 7.);
    
    // define Radii for easy testing
    float radius=.1;
    float radiusMoon=.02;

    vec2 center=vec2(0.,0.);
    
    // Calculate the Position of the Sun and each Planet
    // depends on Orbit Radius, speed
    float positionSun=calcPositionOfObject(distSun,0.,position,center, mouseX);
    float positionMercury=calcPositionOfObject(distMercury,speedMercury,position,center, mouseX);
    float positionVenus=calcPositionOfObject(distVenus,speedVenus,position,center, mouseX);
    float positionEarth=calcPositionOfObject(distEarth,speedEarth,position,center, mouseX);
    float positionMars=calcPositionOfObject(distMars,speedMars,position,center, mouseX);
    float positionJupiter=calcPositionOfObject(distJupiter,speedJupiter,position,center, mouseX);
    float positionSaturn=calcPositionOfObject(distSaturn,speedSaturn,position,center, mouseX);
    float positionUranus=calcPositionOfObject(distUranus,speedUranus,position,center, mouseX);
    float positionNeptun=calcPositionOfObject(distNeptun,speedNeptun,position,center, mouseX);
    float positionStar=calcPositionOfObject(distStar,speedStar,position,centerStar, mouseX);

    float PositionPacman = calcPositionOfPacman(distNeptun, 1.1 * speedNeptun, position, center, mouseX);

    //float positionEarth = calcPositionOfObject()

    // calculate the planets appearence
    float circleSun=smoothstep(positionSun-.04,positionSun,coeffSun*radius);
    float circleMercury=step(positionMercury,coeffMercury*radius);
    float circleVenus=step(positionVenus,coeffVenus*radius);
    float circleEarth=step(positionEarth,coeffEarth*radius);
    float circleMars=step(positionMars,coeffMars*radius);
    float circleJupiter=step(positionJupiter,coeffJupiter*radius);
    float circleSaturn=step(positionSaturn,coeffSaturn*radius);
    float circleUranus=step(positionUranus,coeffUranus*radius);
    float circleNeptun=step(positionNeptun,coeffNeptun*radius);
    float circleStar=step(positionStar,coeffStar*radius);

    float circleAll = circleSun + circleMercury + circleVenus + circleEarth + circleMars + circleJupiter + circleSaturn + circleUranus + circleNeptun;

    float circlePacman = step(PositionPacman, coeffJupiter * radius);
    
    // calculate the Center of the Planets to use them later as Center
    // of the Moon Rotations
    vec2 centerEarth=calcCenterOfObject(-distEarth,.622,position,center, mouseX);
    vec2 centerMars=calcCenterOfObject(-distMars,.504,position,center, mouseX);
    vec2 centerJupiter=calcCenterOfObject(-distJupiter,.273,position,center, mouseX);
    vec2 centerSaturn=calcCenterOfObject(-distSaturn,.202,position,center, mouseX);
    vec2 centerUranus=calcCenterOfObject(-distUranus,.142,position,center, mouseX);
    vec2 centerNeptun=calcCenterOfObject(-distNeptun,.114,position,center, mouseX);

    vec2 centerPacman = calcCenterOfObject(distNeptun, 1.1 * speedNeptun, position, center, mouseX);

    if(circlePacman == circleNeptun){
        eatenNeptun = true;
    }
    // Moon Positions:
    //
    // Earth Moon: Distance 0, 1 circulation per 28 days
    float positionEarthMoon1=calcPositionOfObject(coeffEarth*coeffMoon,356./28.*speedEarth,position,centerEarth, mouseX);
    
    // Mars Moons
    float positionMarsMoon1=calcPositionOfObject(coeffMars*coeffMoon+0.,MoonSpeed(.31),position,centerMars, mouseX);
    float positionMarsMoon2=calcPositionOfObject(coeffMars*coeffMoon+.02,MoonSpeed(1.292),position,centerMars, mouseX);
    
    // Jupiter Moons
    float positionJupiterMoon1=calcPositionOfObject(coeffJupiter*coeffMoon+.01,MoonSpeed(1.77),position,centerJupiter, mouseX);
    float positionJupiterMoon2=calcPositionOfObject(coeffJupiter*coeffMoon+.015,MoonSpeed(3.55),position,centerJupiter, mouseX);
    float positionJupiterMoon3=calcPositionOfObject(coeffJupiter*coeffMoon+.025,MoonSpeed(7.16),position,centerJupiter, mouseX);
    float positionJupiterMoon4=calcPositionOfObject(coeffJupiter*coeffMoon+.04,MoonSpeed(16.69),position,centerJupiter, mouseX);
    
    // Saturn Moons
    float positionSaturnMoon1=calcPositionOfObject(coeffSaturn*coeffMoon+.005,MoonSpeed(.94),position,centerSaturn, mouseX);
    float positionSaturnMoon2=calcPositionOfObject(coeffSaturn*coeffMoon+.01,MoonSpeed(1.37),position,centerSaturn, mouseX);
    float positionSaturnMoon3=calcPositionOfObject(coeffSaturn*coeffMoon+.012,MoonSpeed(1.89),position,centerSaturn, mouseX);
    float positionSaturnMoon4=calcPositionOfObject(coeffSaturn*coeffMoon+.015,MoonSpeed(2.74),position,centerSaturn, mouseX);
    
    // Uranus Moons
    float positionUranusMoon1=calcPositionOfObject(coeffUranus*coeffMoon+.005,MoonSpeed(2.52),position,centerUranus, mouseX);
    float positionUranusMoon2=calcPositionOfObject(coeffUranus*coeffMoon+.01,MoonSpeed(4.14),position,centerUranus, mouseX);
    float positionUranusMoon3=calcPositionOfObject(coeffUranus*coeffMoon+.017,MoonSpeed(8.71),position,centerUranus, mouseX);
    float positionUranusMoon4=calcPositionOfObject(coeffUranus*coeffMoon+.02,MoonSpeed(13.46),position,centerUranus, mouseX);
    
    // Neptun Moons
    float positionNeptunMoon1=calcPositionOfObject(coeffNeptun*coeffMoon+0.,MoonSpeed(5.88),position,centerNeptun, mouseX);
    float positionNeptunMoon2=calcPositionOfObject(coeffNeptun*coeffMoon+.01,MoonSpeed(360.),position,centerNeptun, mouseX);
    
    // Star Positions
    
    // calculate the appearence of the moons
    // Earth Moons
    float circleEarthMoon1=step(positionEarthMoon1,.2*radiusMoon);
    
    // Mars Moons (actually they are tiny (22 and 12km) so they are upscaled)
    float circleMarsMoon1=step(positionMarsMoon1,.1*radiusMoon);
    float circleMarsMoon2=step(positionMarsMoon2,.1*radiusMoon);
    
    // Jupiter Moons
    float circleJupiterMoon1=step(positionJupiterMoon1,.2*radiusMoon);
    float circleJupiterMoon2=step(positionJupiterMoon2,.18*radiusMoon);
    float circleJupiterMoon3=step(positionJupiterMoon3,.25*radiusMoon);
    float circleJupiterMoon4=step(positionJupiterMoon4,.23*radiusMoon);
    
    // Saturn Moons
    float circleSaturnMoon1=step(positionSaturnMoon1,.1*radiusMoon);
    float circleSaturnMoon2=step(positionSaturnMoon2,.1*radiusMoon);
    float circleSaturnMoon3=step(positionSaturnMoon3,.13*radiusMoon);
    float circleSaturnMoon4=step(positionSaturnMoon4,.13*radiusMoon);
    
    // Uranus Moons
    float circleUranusMoon1=step(positionUranusMoon1,.13*radiusMoon);
    float circleUranusMoon2=step(positionUranusMoon2,.13*radiusMoon);
    float circleUranusMoon3=step(positionUranusMoon3,.15*radiusMoon);
    float circleUranusMoon4=step(positionUranusMoon4,.15*radiusMoon);
    
    // Neptun Moons
    float circleNeptunMoon1=step(positionNeptunMoon1,.2*radiusMoon);
    float circleNeptunMoon2=step(positionNeptunMoon2,.1*radiusMoon);


    
    
    // combine colors and appearence of the Objects to display them in space:
    // Sun / Planets:
    vec4 colors=colorSun*circleSun;
    colors+=colorMercury*circleMercury;
    colors+=colorVenus*circleVenus;
    colors+=colorEarth*circleEarth;
    colors+=colorMars*circleMars;
    colors+=colorJupiter*circleJupiter;
    colors+=colorSaturn*circleSaturn;
    colors+=colorUranus*circleUranus;

    if(eatenNeptun == false){
        colors+=colorNeptun*circleNeptun;    
    }

    //colors+=colorStar1*circleStar*animation;

    float angle = atan((position.y - centerPacman.y) / (position.x - centerPacman.x));

    if(centerPacman.x < 0.){
        angle = angle + PI * 0.5 * sign((position.x - centerPacman.x));
        float distance = length(centerPacman - position);
        if (distance < radius * coeffJupiter && angle > sign(mouseX)*-centerPacman.x * -PI * 0.25 && angle < sign(mouseX)*-centerPacman.x * PI * 0.25)
    {
       vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
       colors -= color;
    }
    else
    {
       vec4 color = vec4(0.0);
       color += colors;
       
    }
    }else{
        angle = -angle + PI * 0.5 * sign((position.x - centerPacman.x));
         float distance = length(centerPacman - position);
         if (distance < radius * coeffJupiter && angle > sign(mouseX) * centerPacman.x * -PI * 0.25 && angle < sign(mouseX) * centerPacman.x * PI * 0.25)
    {
       vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
       colors -= color;
    }
    else
    {
       vec4 color = vec4(0.0);
       color += colors;
       
    }
    }

    colors += colorSun * circlePacman;
    
    for(float a = 1.0; a<1.05; a+=0.004){
        float positionAsteroid = calcPositionOfAsteroid(distEarth, speedMercury, position, center, a);
        float circleAsteroid = step(positionAsteroid, 0.1 * radius * (16. - 15. *a));
        colors += colorSun * circleAsteroid;
    }
    
    for(float o = 0.; o <150.; o++){
        float positionStar1=calcPositionOfObject(0.,1.,0.5 * position + .5,vec2(random(vec2(floor(position + o))),random(vec2(0.5 * floor(position + o)))), mouseX);
        float circleStar1=step(positionStar1,0.001);
        colors += overlap(circleStar1, circleAll) * colorStar1;
    }
    for(float o = 0.; o < 30.; o++){
        float positionStar1=calcPositionOfObject(0.,1.,0.5 * position + .5,vec2(random(vec2(floor(10. + u_time + o))),random(vec2(floor(0.5 * u_time + o)))), mouseX);
        float circleStar2=step(positionStar1,0.002);
        colors += overlap(circleStar2, circleAll) * colorStar2 * animation1;
    }
    for(float o = 0.; o <30.; o++){
        float positionStar1=calcPositionOfObject(0.,1.,0.8 * position + .5,vec2(random(vec2(floor(10. + u_time + o))),random(vec2(floor(0.5 * u_time + o)))), mouseX);
        float circleStar3=step(positionStar1,0.001);
        colors += overlap(circleStar3, circleAll) * colorStar3 * animation2;
    }
    
    
    // Moons:
    colors+=colorMoon*circleEarthMoon1;
    colors+=colorPhobos*circleMarsMoon2;
    colors+=colorDeimos*circleJupiterMoon1;
    colors+=colorIo*circleJupiterMoon2;
    colors+=colorEuropa*circleMarsMoon1;
    colors+=colorGanymede*circleJupiterMoon3;
    colors+=colorCallisto*circleJupiterMoon4;
    colors+=colorMimas*circleSaturnMoon1;
    colors+=colorEnceladus*circleSaturnMoon2;
    colors+=colorTethys*circleSaturnMoon3;
    colors+=colorDione*circleSaturnMoon4;
    colors+=colorAriel*circleUranusMoon1;
    colors+=colorUmbriel*circleUranusMoon2;
    colors+=colorTitania*circleUranusMoon3;
    colors+=colorOberon*circleUranusMoon4;
    colors+=colorTriton*circleNeptunMoon1;
    colors+=colorNereid*circleNeptunMoon2;

    
    
    // Calculate Orbits: (delete the part where the planet is currently located)
    vec3 orbitMercury=createOrbit(.15,position-circleMercury);
    vec3 orbitVenus=createOrbit(.2,position-circleVenus);
    vec3 orbitEarth=createOrbit(.25,position-circleEarth);
    vec3 orbitMars=createOrbit(.3,position-circleMars);
    vec3 orbitJupiter=createOrbit(.5,position-circleJupiter);
    vec3 orbitSaturn=createOrbit(.6,position-circleSaturn);
    vec3 orbitUranus=createOrbit(.8,position-circleUranus);
    vec3 orbitNeptun=createOrbit(.95,position-circleNeptun);
    
    // Add Orbits
    colors+=vec4(orbitMercury,1.);
    colors+=vec4(orbitVenus,1.);
    colors+=vec4(orbitEarth,1.);
    colors+=vec4(orbitMars,1.);
    colors+=vec4(orbitJupiter,1.);
    colors+=vec4(orbitSaturn,1.);
    colors+=vec4(orbitUranus,1.);
    colors+=vec4(orbitNeptun,1.);
    
    gl_FragColor=colors;
}