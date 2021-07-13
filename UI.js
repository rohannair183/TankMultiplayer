// class UI {
//     constructor() {
//         this.button = createButton("click me");
//         this.button.parent("sketch01");
//         this.button.parent("button");
//     }

//     draw() {
//         push();
//         // Text
//         textSize(32);
//         text("word", 10, 30);
//         translate(-p.pos.x, -p.pos.y);
//         // noFill();

//         // UI area
//         rectMode(CENTER);
//         strokeWeight(5);
//         stroke(30, 200);
//         fill(255, 150);
//         rect(width / 2, height - 40, width * 0.99, 80, 5);

//         // Buttons
//         let tSpeed = {
//             x: width * 0.1,
//             y: height - 40,
//         };
//         let bSpeed = {
//             x:
//                 width * 0.1 +
//                 (1 * (width * 0.99)) / 7 +
//                 (1 * (((width * 0.99) / 7) * 2)) / 5,

//             y: height - 40,
//         };
//         let damage = {
//             x:
//                 width * 0.1 +
//                 (2 * (width * 0.99)) / 7 +
//                 (2 * (((width * 0.99) / 7) * 2)) / 5,
//             y: height - 40,
//         };
//         const BUTTON_WIDTH = (width * 0.99) / 7;
//         const BUTTON_HEIGHT = 40;

//         this.button.position(tSpeed.x, tSpeed.y);
//         this.button.mousePressed(() => console.log("yay!"));

//         rect(tSpeed.x, tSpeed.y, BUTTON_WIDTH, BUTTON_HEIGHT);
//         rect(bSpeed.x, bSpeed.y, BUTTON_WIDTH, BUTTON_HEIGHT);
//         rect(damage.x, damage.y, BUTTON_WIDTH, BUTTON_HEIGHT);

//         rect(
//             width * 0.1 +
//                 (3 * (width * 0.99)) / 7 +
//                 (3 * (((width * 0.99) / 7) * 2)) / 5,
//             height - 40,
//             BUTTON_WIDTH,
//             BUTTON_HEIGHT
//         );
//         rect(
//             width * 0.1 +
//                 (4 * (width * 0.99)) / 7 +
//                 (4 * (((width * 0.99) / 7) * 2)) / 5,
//             height - 40,
//             BUTTON_WIDTH,
//             BUTTON_HEIGHT
//         );

//         let clicked = function (buttonCords, buttonWidth, buttonHeight) {
//             let x = buttonCords.x;
//             let y = buttonCords.y;

//             if (
//                 mouseIsPressed &&
//                 mouseX > x - 0.5 * buttonWidth &&
//                 mouseX < x + 0.5 * buttonWidth
//             ) {
//                 if (
//                     mouseY > y - 0.5 * buttonHeight &&
//                     mouseY < y + 0.5 * buttonHeight
//                 ) {
//                     console.log("Works!");
//                 }
//             }
//         };
//         // clicked(tSpeed, BUTTON_WIDTH, BUTTON_HEIGHT);

//         pop();
//     }
// }
