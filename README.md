# Three.js Interactive Scene Project

## Overview
This project is a Three.js-based interactive 3D scene that demonstrates the following functionalities:

1. **Interactive Objects**: Objects in the scene (e.g., a cube and a sphere) respond to mouse hover and clicks.
2. **Camera Controls**: The camera can move in all three axes and rotate based on user input.
3. **Scene Transitions**: Clicking on an object transitions to a unique "inside" scene for that object.
4. **Dynamic Lines**: A line is drawn dynamically between two objects in the scene.
5. **Hover Text**: Displays unique text for each object when hovered over.

## Features

### Interactive Objects
- Objects in the scene are stored in an array (`interactiveObjects`).
- Each object has unique metadata (`userData.text`) for hover text.
- Hovering over an object changes its color and displays its text.
- Clicking on an object transitions to a unique scene associated with that object.

### Camera Controls
- The camera can move forward, backward, left, right, up, and down using the `W`, `A`, `S`, `D`, `Q`, and `E` keys.
- The camera can rotate horizontally and vertically by dragging the mouse.
- Movement and rotation are processed simultaneously for smooth controls.

### Scene Transitions
- Each object has a unique "inside" scene defined in separate modules (`cubeScene.js` and `sphereScene.js`).
- Clicking on an object transitions to its associated scene using the `renderScene` function.

### Dynamic Lines
- A function `drawLineBetweenObjects` dynamically draws a line between two objects in the scene.
- The line is created using `THREE.BufferGeometry` and `THREE.LineBasicMaterial`.

### Hover Text
- A `div` element is used to display text when hovering over an object.
- The text updates dynamically based on the hovered object.
- The position of the text is calculated relative to the mouse pointer.

## File Structure

- `main.js`: The entry point of the application. Initializes the scene, camera, renderer, and interactive objects. Handles user input and animation.
- `globals.js`: Contains shared utilities like the `raycaster`, `mouse`, and event listeners for mouse movement.
- `cubeScene.js`: Defines the "inside" scene for the cube.
- `sphereScene.js`: Defines the "inside" scene for the sphere.
- `index.html`: The HTML file that loads the Three.js application.

## How It Works

1. **Initialization**:
   - The `main.js` file initializes the Three.js scene, camera, and renderer.
   - Interactive objects (cube and sphere) are added to the scene and stored in the `interactiveObjects` array.

2. **Hover Interaction**:
   - The `raycaster` detects intersections between the mouse pointer and objects in the scene.
   - When an object is hovered over, its color changes, and its unique text is displayed.

3. **Click Interaction**:
   - Clicking on an object transitions to its associated "inside" scene using the `renderScene` function.

4. **Camera Controls**:
   - The `updateCamera` function handles both movement and rotation of the camera.
   - Movement is controlled by keyboard input, and rotation is controlled by mouse drag.

5. **Dynamic Lines**:
   - The `drawLineBetweenObjects` function creates a line between two objects using their positions.

## How to Run

1. Clone the repository or download the project files.
2. Install dependencies (if any) using `npm install`.
3. Open `index.html` in a browser to view the application.

## Dependencies
- [Three.js](https://threejs.org/): A JavaScript library for creating 3D graphics in the browser.

## Future Improvements
- Add more interactive objects and scenes.
- Implement advanced camera controls (e.g., orbit controls).
- Add animations or particle effects to the "inside" scenes.

## License
This project is open-source and available under the [MIT License](LICENSE).
