module.exports = data => {
	let sumProducts = 0
	let sumWeights = 0

	data.forEach(pair => {
		let number = pair[0]
		let weight = pair[1]

		sumProducts += number * weight
		sumWeights += weight
	})

	if (!sumWeights) {
		return 0
	}

	// return weighted mean
	return sumProducts / sumWeights;
}