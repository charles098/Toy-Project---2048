const td = document.getElementsByTagName('td');
const sc = document.getElementsByClassName('score')[0];
const btn = document.getElementsByClassName('newGame')[0];

// 4x4 빈 배열 생성
const table = Array.from(Array(4), () => Array(4).fill(''));

// 빈 칸 인덱스 - generate에 쓰인다
let possible;
let score = 0;
let max = 0;

// 1. 시작 - 랜덤으로 두 칸 2로 초기화
generate();
generate();
load();

// 2. 방향키 누르는 이벤트 삽입
document.addEventListener("keydown", keyDownHandler, false);

// 3. 방향키 떼는 이벤트 삽입
document.addEventListener("keyup", keyUpHandler);

// 4. new game 클릭 이벤트 삽입
btn.addEventListener('click', () => {
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            table[i][j] = '';
        }
    }
    sc.textContent = 0;
    generate();
    generate();
    load();
});

// 방향키 떼는 콜벡함수
function keyUpHandler(e){
    if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
        if(isOver()) alert('Game Over');
    }
    if(max == 2048) alert(`Congratulation! Your score is ${score}`);
}

// 방향키 누르는 콜벡함수
function keyDownHandler(e) {
    let moved = false;
    if(e.keyCode == 39) {
        console.log('오른쪽'); // 우
        for(let i = 0; i < 4; i++){
            for(let fix = 3; fix >= 0; fix--){ // 가장 우측값
                // 1. 값이 없으면 값 찾아서 fix로 가져와야 함
                // 2. 값이 있으면 
                    // - 같은 값 있으면 더한값으로 fix 초기화
                    // - 같은 값 없으면 fix-1 으로 옮겨놓는다
                if(table[i][fix] == ''){
                    // 값이 없으면 값 찾아서 가져와야 함
                    for(let j = fix-1; j >= 0; j--){
                        if(table[i][j] != ''){
                            move(i,j,i,fix);
                            moved = true;
                            break; // 움직임
                        }
                    }
                }
                if(table[i][fix] != ''){
                    // 값 있으면
                    for(let j = fix-1; j >= 0; j--){
                        if(table[i][j] != ''){
                            if(table[i][j] == table[i][fix]){
                                // 같은 값 있으면 더한값으로 fix 초기화
                                move(i,j,i,fix,1);
                                moved = true;
                                break; // 움직임
                            }
                            else{
                                // 같은 값 없으면 fix-1 로 옮긴다
                                move(i,j,i,fix-1);
                                if(j != fix-1){
                                    moved = true; // 움직임
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    else if(e.keyCode == 37) {
        console.log('왼쪽') 
        for(let i = 0; i < 4; i++){
            for(let fix = 0; fix <= 3; fix++){ 
                if(table[i][fix] == ''){
                    for(let j = fix+1; j <= 3; j++){
                        if(table[i][j] != ''){
                            move(i,j,i,fix);
                            moved = true;
                            break; // 움직임
                        }
                    }
                }
                if(table[i][fix] != ''){
                    for(let j = fix+1; j <= 3; j++){
                        if(table[i][j] != ''){
                            if(table[i][j] == table[i][fix]){
                                move(i,j,i,fix,1);
                                moved = true;
                                break; // 움직임
                            }
                            else{
                                move(i,j,i,fix+1);
                                if(j != fix+1){
                                    moved = true; // 움직임
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    else if(e.keyCode == 38){
        console.log('위'); 
        for(let j = 0; j < 4; j++){
            for(let fix = 0; fix <= 3; fix++){ 
                if(table[fix][j] == ''){
                    for(let i = fix+1; i <= 3; i++){
                        if(table[i][j] != ''){
                            move(i,j,fix,j);
                            moved = true;
                            break; // 움직임
                        }
                    }
                }
                if(table[fix][j] != ''){
                    for(let i = fix+1; i <= 3; i++){
                        if(table[i][j] != ''){
                            if(table[i][j] == table[fix][j]){
                                move(i,j,fix,j,1);
                                moved = true;
                                break; // 움직임
                            }
                            else{
                                move(i,j,fix+1,j);
                                if(i != fix+1){
                                    moved = true; // 움직임
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    else if(e.keyCode == 40){
        console.log('아래');
        for(let j = 0; j < 4; j++){
            for(let fix = 3; fix >= 0; fix--){ 
                if(table[fix][j] == ''){
                    for(let i = fix-1; i >= 0; i--){
                        if(table[i][j] != ''){
                            move(i,j,fix,j);
                            moved = true;
                            break; // 움직임
                        }
                    }
                }
                if(table[fix][j] != ''){
                    for(let i = fix-1; i >= 0; i--){
                        if(table[i][j] != ''){
                            if(table[i][j] == table[fix][j]){
                                move(i,j,fix,j,1);
                                moved = true;
                                break; // 움직임
                            }
                            else{
                                move(i,j,fix-1,j);
                                if(i != fix-1){
                                    moved = true; // 움직임
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    if(moved) generate();
    load();
}

function isOver(){
    for(let i = 0; i < 4; i++){
        // 행 검사
        for(let j = 0; j < 4; j++){
            if(table[i][j] == '') return false;
            else if(j == 0 && table[i][j] == table[i][j+1]) return false;
            else if(j == 3 && table[i][j] == table[i][j-1]) return false;
            else if(j != 0 && j != 3){
                if(table[i][j] == table[i][j-1] || table[i][j] == table[i][j+1]) return false;
            }
        }
    }

    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(i == 0 && table[i][j] == table[i+1][j]) return false;
            else if(i == 3 && table[i][j] == table[i-1][j]) return false;
            else if(i != 0 && i !=3){
                if(table[i][j] == table[i-1][j] || table[i][j] == table[i+1][j]) return false;
            }
        }
    }
    return true;
}

// 테이블 값 이동
function move(fromR, fromC, toR, toC, add = 0) {
    let tmp = table[fromR][fromC];
    if(add == 1){
        tmp += table[toR][toC];
        score += tmp;
        sc.textContent = score;
        max = max > tmp ? max : tmp;
    }
    table[fromR][fromC] = '';
    table[toR][toC] = tmp;
}

// 값 생성
function generate(){
    possible = [];
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(table[i][j] == ''){
                possible.push([i, j]);
            }
        }
    }    
    let delIdx = Math.floor(Math.random() * possible.length);
    let row = possible[delIdx][0];
    let col = possible[delIdx][1];

    // 1 : 9 확률
    const rand = Math.random();
    if(rand < 0.1) table[row][col] = 4;
    else table[row][col] = 2;
}

// table 데이터를 td 객체에 반영
function load(){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            pushVal(i, j, table[i][j]);
        }
    }
}

// tb에 숫자 및 스타일 추가하는 함수
function pushVal(row, col, number){

    // n행 m열 -> td[4*n + m]
    let elem = td[4 * row + col]; // td에서의 원소 객체
    
    switch(number){
        case '': // 빈칸
            elem.textContent = '';
            elem.style.backgroundColor = '#CBC1B7';
            break;
        case 2:
            elem.textContent = 2;
            elem.style.backgroundColor = '#ECE4DB';
            elem.style.color = '#746E65';
            break;
        case 4:
            elem.textContent = 4;
            elem.style.backgroundColor = '#ECE1CC';
            elem.style.color = '#746E65';
            break;
        case 8:
            elem.textContent = 8;
            elem.style.backgroundColor = "#E8B482";
            elem.style.color = '#F9F6F3';
            break;
        case 16:
            elem.textContent = 16;
            elem.style.backgroundColor = '#E89A6C';
            elem.style.color = '#F9F6F3';
            break;
        case 32:
            elem.textContent = 32;
            elem.style.backgroundColor = '#E58366';
            elem.style.color = '#F9F6F3';
            break;
        case 64:
            elem.textContent = 64;
            elem.style.backgroundColor = '#E46848';
            elem.style.color = '#F9F6F3';
            break;
        case 128:
            elem.textContent = 128;
            elem.style.backgroundColor = '#E8D080';
            elem.style.color = '#F9F6F3';
            break;
        case 256:
            elem.textContent = 256;
            elem.style.backgroundColor = '#E8CD73';
            elem.style.color = '#F9F6F3';
            break;
        case 512:
            elem.textContent = 512;
            elem.style.backgroundColor = '#E6C964';
            elem.style.color = '#F9F6F3';
            break;
        case 1024:
            elem.textContent = 1024;
            elem.style.backgroundColor = '#E6C659';
            elem.style.color = '#F9F6F3';
            break;
        case 2048:
            elem.textContent = 2048;
            elem.style.backgroundColor = '#E5C44F';
            elem.style.color = '#F9F6F3';
            break;
    }
}

