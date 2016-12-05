window.TilesetImporter = window.TilesetImporter || {};

window.TilesetImporter.import = file => {
	return new Promise((resolve, reject) => {
		if (!file) reject("Invalid file");

		const fileType = file.type.indexOf("image") !== -1 ? "image" : undefined;
		if (fileType !== "image") reject("File is not an image"); // TODO: Should also accept JSON input (after that's implemented in dtile-tilemap)

		const fileReader = new FileReader();

		fileReader.onload = () => {
			resolve(fileReader.result);
		};

		fileReader.readAsDataURL(file);
	});
};
