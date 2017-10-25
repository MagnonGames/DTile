export default `
uniform sampler2D texture;
uniform vec2 tileSize;
uniform float lineWidth;

varying vec2 uvFinal;
varying vec3 vertexColor;
varying float vertexColorOpacity;
varying float vertexOpacity;

varying vec2 vertexPosition;

vec4 normalBlend(vec4 b, vec4 s) {
    if (b.a <= 0.0) return s;

    vec3 cm = s.rgb * s.a + b.rgb * b.a * (1.0 - s.a);

    float ao = s.a + b.a * (1.0 - s.a);
    vec3 co = cm / ao;

    return vec4(co, ao);
}

vec4 line() {
    if (lineWidth <= 0.0) return vec4(0.0);

    // Credit goes here: http://madebyevan.com/shaders/grid/
    // Only a few modifications were made to size it correctly.
    vec2 coord = vertexPosition.xy / tileSize;

    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord) / lineWidth;
    float line = min(grid.x, grid.y);

    return vec4(vec3(0.0), 1.0 - min(line, 1.0));
}

void main() {
    vec4 textureColor = texture2D(texture, uvFinal);
    textureColor.a *= vertexOpacity;
    textureColor.a *= uvFinal.x + uvFinal.y < -1.0 ? 0.0 : 1.0;

    vec4 firstColor = normalBlend(textureColor, line());
    vec4 secondColor = vec4(vertexColor, vertexColorOpacity);

    vec4 finalColor = normalBlend(firstColor, secondColor);

    gl_FragColor = finalColor;
}
`;
