module.exports = (input, count) => {
	const regex = new RegExp(`(.{${count}})`, 'g');

	return input.replace(regex, '$1\n');
};