// =====================================
        // DOM Elements
        // =====================================

        const gameBoard =
            document.getElementById("gameBoard");


        const statusMessage =
            document.getElementById("statusMessage");


        const levelText =
            document.getElementById("levelText");


        const hpText =
            document.getElementById("hpText");


        const scoreText =
            document.getElementById("scoreText");


        const treasureText =
            document.getElementById("treasureText");


        const startButton =
            document.getElementById("startButton");


        const restartButton =
            document.getElementById("restartButton");


        const increaseLevelButton =
            document.getElementById("increaseLevelButton");


        const decreaseLevelButton =
            document.getElementById("decreaseLevelButton");


        const helpButton =
            document.getElementById("helpButton");


        const helpPanel =
            document.getElementById("helpPanel");


        const themeButton =
            document.getElementById("themeButton");



        // =====================================
        // Game Variables
        // =====================================

        let level = 1;

        const maxLevel = 5;

        const minLevel = 1;

        let hp = 3;

        let score = 0;

        let gameStarted = false;

        let gameEnded = false;



        let player = {

            row: 1,

            col: 1

        };



        let treasures = [];



        let collectedTreasures = 0;



        let exit = {

            row: 8,

            col: 8

        };



        let walls = [];



        // =====================================
        // Map
        // =====================================

        const baseMap = [

            "##########",

            "#P.......#",

            "#.####...#",

            "#....#...#",

            "#....#...#",

            "#....#...#",

            "#........#",

            "#...####.#",

            "#........#",

            "##########"

        ];



        // =====================================
        // ตำแหน่งเพชรแต่ละ Level
        // =====================================

        const treasurePositions = {

            1: [

                { row: 6, col: 7 }

            ],


            2: [

                { row: 4, col: 7 },

                { row: 6, col: 5 }

            ],


            3: [

                { row: 3, col: 7 },

                { row: 5, col: 7 },

                { row: 6, col: 5 }

            ],


            4: [

                { row: 3, col: 7 },

                { row: 4, col: 7 },

                { row: 5, col: 7 },

                { row: 6, col: 5 }

            ],


            5: [

                { row: 3, col: 7 },

                { row: 4, col: 7 },

                { row: 5, col: 7 },

                { row: 6, col: 5 },

                { row: 8, col: 5 }

            ]

        };



        // =====================================
        // Create Map
        // =====================================

        function createMap() {

            walls = [];


            for (
                let row = 0;
                row < baseMap.length;
                row++
            ) {

                for (
                    let col = 0;
                    col < baseMap[row].length;
                    col++
                ) {

                    if (baseMap[row][col] === "#") {

                        walls.push(
                            `${row}-${col}`
                        );

                    }

                }

            }



            player = {

                row: 1,

                col: 1

            };



            exit = {

                row: 8,

                col: 8

            };



            // สร้างเพชรตาม Level

            treasures =
                treasurePositions[level].map(
                    position => ({

                        row: position.row,

                        col: position.col,

                        collected: false

                    })
                );



            collectedTreasures = 0;

        }



        // =====================================
        // Draw Board
        // =====================================

        function drawBoard() {

            gameBoard.innerHTML = "";


            const rows =
                baseMap.length;


            const columns =
                baseMap[0].length;


            gameBoard.style.gridTemplateColumns =
                `repeat(${columns}, minmax(0, 1fr))`;



            for (
                let row = 0;
                row < rows;
                row++
            ) {

                for (
                    let col = 0;
                    col < columns;
                    col++
                ) {

                    const cell =
                        document.createElement("div");


                    cell.className =
                        "flex aspect-square items-center justify-center text-lg sm:text-2xl";


                    const position =
                        `${row}-${col}`;



                    // กำแพง

                    if (
                        walls.includes(position)
                    ) {

                        cell.className +=
                            " bg-slate-800 dark:bg-slate-950";

                        cell.textContent =
                            "⬛";

                    }



                    // Player

                    else if (

                        player.row === row &&

                        player.col === col

                    ) {

                        cell.className +=
                            " bg-blue-500 dark:bg-blue-700";

                        cell.textContent =
                            "🧑";

                    }



                    // Treasure

                    else {

                        const treasure =
                            treasures.find(
                                item =>
                                    item.row === row &&
                                    item.col === col &&
                                    !item.collected
                            );



                        if (treasure) {

                            cell.className +=
                                " bg-yellow-100 dark:bg-yellow-900";

                            cell.textContent =
                                "💎";

                        }



                        // Exit

                        else if (

                            exit.row === row &&

                            exit.col === col

                        ) {

                            cell.className +=
                                " bg-green-100 dark:bg-green-900";

                            cell.textContent =
                                "🏁";

                        }



                        // พื้น

                        else {

                            cell.className +=
                                " bg-emerald-50 dark:bg-emerald-950";

                        }

                    }


                    gameBoard.appendChild(cell);

                }

            }


            updateInformation();

        }



        // =====================================
        // Update Information
        // =====================================

        function updateInformation() {

            levelText.textContent =
                level;


            hpText.textContent =
                hp;


            scoreText.textContent =
                score;


            treasureText.textContent =
                `${collectedTreasures}/${treasures.length}`;

        }



        // =====================================
        // Status Message
        // =====================================

        function updateStatus(
            message,
            type = "normal"
        ) {

            statusMessage.textContent =
                message;



            if (type === "success") {

                statusMessage.className =
                    "mb-4 rounded-xl bg-green-50 p-3 text-center font-medium text-green-800 dark:bg-green-950 dark:text-green-200";

            }


            else if (type === "danger") {

                statusMessage.className =
                    "mb-4 rounded-xl bg-red-50 p-3 text-center font-medium text-red-800 dark:bg-red-950 dark:text-red-200";

            }


            else {

                statusMessage.className =
                    "mb-4 rounded-xl bg-blue-50 p-3 text-center font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200";

            }

        }



        // =====================================
        // Check Wall
        // =====================================

        function isWall(row, col) {

            return walls.includes(
                `${row}-${col}`
            );

        }



        // =====================================
        // Move Player
        // =====================================

        function movePlayer(
            rowChange,
            colChange
        ) {

            if (
                !gameStarted ||
                gameEnded
            ) {

                return;

            }



            const newRow =
                player.row + rowChange;


            const newCol =
                player.col + colChange;



            // ชนกำแพง

            if (
                isWall(newRow, newCol)
            ) {

                hp--;


                updateStatus(
                    `💥 ชนกำแพง! HP เหลือ ${hp}`,
                    "danger"
                );


                if (hp <= 0) {

                    gameOver();

                }


                drawBoard();

                return;

            }



            // ออกจากแผนที่

            if (

                newRow < 0 ||

                newRow >= baseMap.length ||

                newCol < 0 ||

                newCol >= baseMap[0].length

            ) {

                return;

            }



            player.row =
                newRow;


            player.col =
                newCol;



            checkGameEvents();


            drawBoard();

        }



        // =====================================
        // Check Game Events
        // =====================================

        function checkGameEvents() {


            // ตรวจสอบการเก็บเพชร

            treasures.forEach(
                treasure => {

                    if (

                        !treasure.collected &&

                        player.row === treasure.row &&

                        player.col === treasure.col

                    ) {

                        treasure.collected =
                            true;


                        collectedTreasures++;


                        score += 100;



                        updateStatus(
                            `💎 เก็บเพชรแล้ว! ${collectedTreasures}/${treasures.length}`,
                            "success"
                        );

                    }

                }
            );



            // ตรวจสอบเส้นชัย

            if (

                player.row === exit.row &&

                player.col === exit.col

            ) {


                // ถ้าเก็บเพชรครบ

                if (
                    collectedTreasures ===
                    treasures.length
                ) {

                    completeLevel();

                }


                else {

                    const remaining =
                        treasures.length -
                        collectedTreasures;


                    updateStatus(
                        `🏁 ยังต้องเก็บเพชรอีก ${remaining} เม็ด`
                    );

                }

            }

        }



        // =====================================
        // Complete Level
        // =====================================

        function completeLevel() {

            score += 200;



            // Level 5 คือด่านสุดท้าย

            if (
                level >= maxLevel
            ) {

                gameEnded = true;


                updateInformation();


                updateStatus(
                    `🏆 ยินดีด้วย! คุณผ่าน Level 5 และชนะเกมแล้ว! คะแนน ${score}`,
                    "success"
                );


                return;

            }



            // เพิ่ม Level อัตโนมัติ

            level++;


            hp = 3;


            gameEnded = false;


            createMap();


            drawBoard();


            updateStatus(
                `🎉 ผ่านด่านสำเร็จ! เข้าสู่ Level ${level} และมี 💎 ${treasures.length} เม็ด`,
                "success"
            );


            gameBoard.focus();

        }



        // =====================================
        // Game Over
        // =====================================

        function gameOver() {

            gameEnded = true;


            updateStatus(
                "💀 Game Over! HP หมดแล้ว",
                "danger"
            );

        }



        // =====================================
        // Start Game
        // =====================================

        function startGame() {

            gameStarted = true;


            gameEnded = false;


            hp = 3;


            score = 0;


            createMap();


            drawBoard();


            updateStatus(
                `🎮 เริ่มเกม Level ${level}! ต้องเก็บ 💎 ${treasures.length} เม็ด`
            );


            gameBoard.focus();

        }



        // =====================================
        // Restart Game
        // =====================================

        function restartGame() {

            startGame();

        }



        // =====================================
        // Increase Level
        // =====================================

        function increaseLevel() {


            if (!gameStarted) {

                updateStatus(
                    "⚠️ กรุณากดเริ่มเกมก่อน",
                    "danger"
                );

                return;

            }


            if (
                level >= maxLevel
            ) {

                updateStatus(
                    "🏆 Level สูงสุดคือ Level 5",
                    "danger"
                );

                return;

            }


            level++;


            hp = 3;


            gameEnded = false;


            createMap();


            drawBoard();


            updateStatus(
                `⬆️ เพิ่มเป็น Level ${level}! ต้องเก็บ 💎 ${treasures.length} เม็ด`
            );


            gameBoard.focus();

        }



        // =====================================
        // Decrease Level
        // =====================================

        function decreaseLevel() {


            if (!gameStarted) {

                updateStatus(
                    "⚠️ กรุณากดเริ่มเกมก่อน",
                    "danger"
                );

                return;

            }


            if (
                level <= minLevel
            ) {

                updateStatus(
                    "⚠️ Level ต่ำสุดคือ Level 1",
                    "danger"
                );

                return;

            }


            level--;


            hp = 3;


            gameEnded = false;


            createMap();


            drawBoard();


            updateStatus(
                `⬇️ ลดเป็น Level ${level}! มี 💎 ${treasures.length} เม็ด`
            );


            gameBoard.focus();

        }



        // =====================================
        // Keyboard
        // =====================================

        function handleKey(event) {

            const key =
                event.key.toLowerCase();


            const movement = {

                arrowup: [-1, 0],

                w: [-1, 0],

                arrowdown: [1, 0],

                s: [1, 0],

                arrowleft: [0, -1],

                a: [0, -1],

                arrowright: [0, 1],

                d: [0, 1]

            };



            if (
                movement[key]
            ) {

                event.preventDefault();


                const [
                    rowChange,
                    colChange
                ] = movement[key];


                movePlayer(
                    rowChange,
                    colChange
                );

            }

        }



        // =====================================
        // Arrow Button
        // =====================================

        function handleControlButton(event) {

            const key =
                event.currentTarget.dataset.key;


            const movement = {

                ArrowUp: [-1, 0],

                ArrowDown: [1, 0],

                ArrowLeft: [0, -1],

                ArrowRight: [0, 1]

            };


            const [
                rowChange,
                colChange
            ] = movement[key];


            movePlayer(
                rowChange,
                colChange
            );


            gameBoard.focus();

        }



        // =====================================
        // Help
        // =====================================

        function toggleHelp() {

            const isHidden =
                helpPanel.hidden;


            helpPanel.hidden =
                !isHidden;


            helpButton.setAttribute(
                "aria-expanded",
                String(isHidden)
            );

        }



        // =====================================
        // Dark Mode
        // =====================================

        function toggleDarkMode() {

            document.documentElement.classList.toggle(
                "dark"
            );


            const isDark =
                document.documentElement.classList.contains(
                    "dark"
                );


            themeButton.textContent =
                isDark
                    ? "☀️ Light Mode"
                    : "🌙 Dark Mode";

        }



        // =====================================
        // Event Listeners
        // =====================================

        startButton.addEventListener(
            "click",
            startGame
        );


        restartButton.addEventListener(
            "click",
            restartGame
        );


        increaseLevelButton.addEventListener(
            "click",
            increaseLevel
        );


        decreaseLevelButton.addEventListener(
            "click",
            decreaseLevel
        );


        helpButton.addEventListener(
            "click",
            toggleHelp
        );


        themeButton.addEventListener(
            "click",
            toggleDarkMode
        );


        document.addEventListener(
            "keydown",
            handleKey
        );


        document
            .querySelectorAll("[data-key]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    handleControlButton
                );

            });



        // =====================================
        // Initialize
        // =====================================

        createMap();

        drawBoard();
