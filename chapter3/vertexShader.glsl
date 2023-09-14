attribute vec4 vPosition;
uniform float theta;
void main(){
    gl_Position.x=vPosition.x*(-sin(theta))+cos(theta)*vPosition.y;
    gl_Position.y=vPosition.y*(sin(theta))+cos(theta)*vPosition.x;
    gl_Position.z=0;
    gl_Position.w=0;
}