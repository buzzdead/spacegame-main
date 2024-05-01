export default /*glsl*/ `
uniform bool active;
uniform vec2 center[centerCount];
uniform float waveSize;
uniform float radius;
uniform float maxRadius;
uniform float amplitude;

varying float vSize;

void mainUv(inout vec2 uv) {

	if(active) {
		for(int i = 0; i < centerCount; i++) {
		vec2 aspectCorrection = vec2(aspect, 1.0);
		vec2 difference = uv * aspectCorrection - center[i] * aspectCorrection;
		float distance = sqrt(dot(difference, difference)) * vSize;

		if(distance > radius) {

			if(distance < radius + waveSize) {

				float angle = (distance - radius) * PI2 / waveSize;
				float cosSin = (1.0 - cos(angle)) * 0.5;

				float extent = maxRadius + waveSize;
				float decay = max(extent - distance * distance, 0.0) / extent;

				uv -= ((cosSin * amplitude * difference) / distance) * decay;

			}

		}
	}

	}

}
`;