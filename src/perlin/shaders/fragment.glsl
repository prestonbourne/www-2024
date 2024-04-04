varying float qnoise;

uniform float time;
uniform bool redhell;

void main() {
  float r, g, b;

  if (redhell == true) {
    r = cos(qnoise + 0.5);
    g = cos(qnoise - 0.5);
    b = 0.0;
  } else {
    r = cos(qnoise);
    g = cos(qnoise + 0.7);
    b = abs(qnoise + 0.1);
  }
  gl_FragColor = vec4(r, g, b, 1);
}