import * as TWEEN from "@tweenjs/tween.js";

// tween.js v25 removed automatic registration with the global default group:
// `new Tween(obj)` is now a "headless" tween that no one ticks unless you pass
// it an explicit Group. We share this single Group across the app and tick it
// from r3f's render loop.
export const tweenGroup = new TWEEN.Group();

export function getAllNodes(grid) {
	const nodes = [];
	for (const row of grid) {
		nodes.push(...row);
	}
	return nodes;
}

// Backtracks from the finishNode to find the shortest path.
export function getNodesInShortestPathOrder(finishNode) {
	const nodesInShortestPathOrder = [];
	let currentNode = finishNode;
	if (currentNode.previousNode !== null) {
		currentNode = currentNode.previousNode;
	}
	while (currentNode !== null) {
		if (currentNode.previousNode === null) {
			break;
		}
		nodesInShortestPathOrder.unshift(currentNode);
		currentNode = currentNode.previousNode;
	}
	return nodesInShortestPathOrder;
}

// Writes an RGB triple into all 6 vertices of a cell in the color BufferAttribute.
function writeCellColor(geometry, node, color) {
	const colorAttr = geometry.getAttribute('color');
	if (!colorAttr) return;
	const offsets = node.vertexOffsets;
	for (let i = 0; i < offsets.length; i++) {
		const idx = offsets[i] * 3;
		colorAttr.array[idx]     = color.r;
		colorAttr.array[idx + 1] = color.g;
		colorAttr.array[idx + 2] = color.b;
	}
	colorAttr.needsUpdate = true;
}

// Animates the cell's color through one or more keyframes.
export function tweenToColor(node, geometry, colors, duration = 300, options) {
	for (let i = 0; i < colors.length; i++) {
		const start = { r: node.color.r, g: node.color.g, b: node.color.b };
		const end = colors[i];
		new TWEEN.Tween(start, tweenGroup)
			.to({ r: end.r, g: end.g, b: end.b }, duration)
			.delay(i * 200)
			.onUpdate(() => {
				node.color.r = start.r;
				node.color.g = start.g;
				node.color.b = start.b;
				writeCellColor(geometry, node, start);
			})
			.start();
	}

	if (options && options.position) {
		const positionAttr = geometry.getAttribute('position');
		if (!positionAttr) return;
		const offsets = node.vertexOffsets;
		new TWEEN.Tween({ y: 0 }, tweenGroup)
			.to({ y: 0.5 }, duration)
			.onUpdate(({ y }) => {
				for (let i = 0; i < offsets.length; i++) {
					positionAttr.array[offsets[i] * 3 + 2] = y;
				}
				positionAttr.needsUpdate = true;
			})
			.chain(
				new TWEEN.Tween({ y: 0.5 }, tweenGroup)
					.to({ y: 0 }, duration)
					.delay(100)
					.onUpdate(({ y }) => {
						for (let i = 0; i < offsets.length; i++) {
							positionAttr.array[offsets[i] * 3 + 2] = y;
						}
						positionAttr.needsUpdate = true;
					})
			)
			.start();
	}
}
