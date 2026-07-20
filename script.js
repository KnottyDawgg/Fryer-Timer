// ========================================
// Fryer Timer v2.0
// ========================================

// ---------- SETTINGS ----------

const SETTINGS = {

    basketCount: 4,

    foods: [

        { name: "🍟 Hand Fries", time: 30 },
        { name: "🍺 Beer Fries", time: 30 },
        { name: "🧇 Waffle Fries", time: 30 },
        { name: "🧅 Onion Rings", time: 30 }

    ]

};

const basketContainer = document.getElementById("basketContainer");

// ---------- BUILD APP ----------

for(let basket=1; basket<=SETTINGS.basketCount; basket++){

    const basketCard=document.createElement("div");

    basketCard.className="basket";

    basketCard.innerHTML=`<h2>Basket ${basket}</h2>`;

    SETTINGS.foods.forEach(food=>{

        basketCard.appendChild(
            createFoodCard(food)
        );

    });

    basketContainer.appendChild(basketCard);

}
// ========================================
// CREATE FOOD CARD
// ========================================

function createFoodCard(food){

    const card = document.createElement("div");

    card.className = "foodCard";

    card.state = "ready";
    card.defaultTime = food.time;
    card.remaining = food.time;
    card.interval = null;

    card.innerHTML = `

        <div class="foodRow">

            <span class="foodName">
                ${food.name}
            </span>

            <span class="timer green">
                ${formatTime(food.time)}
            </span>

        </div>

        <div class="status">
            🟢 Ready
        </div>

        <button class="actionButton green">
            Start
        </button>

    `;

    const button = card.querySelector(".actionButton");

    button.addEventListener("click", (event)=>{

        event.stopPropagation();

        handleButton(card);

    });

    return card;

}
// ========================================
// HELPER FUNCTIONS
// ========================================

function formatTime(seconds){

    const minutes = Math.floor(seconds / 60);

    const remaining = seconds % 60;

    return `${minutes}:${remaining.toString().padStart(2,"0")}`;

}

function handleButton(card){

    switch(card.state){

        case "ready":

            startTimer(card);

            break;

        case "running":

            resetTimer(card);

            break;

        case "done":

            acknowledgeTimer(card);

            break;

    }

}

function updateButton(card,color,text){

    const button = card.querySelector(".actionButton");

    button.className = `actionButton ${color}`;

    button.textContent = text;

}

function updateTimer(card,color){

    const timer = card.querySelector(".timer");

    timer.className = `timer ${color}`;

}
// ========================================
// TIMER ENGINE
// ========================================

function startTimer(card){

    card.state = "running";

    const timer = card.querySelector(".timer");
    const status = card.querySelector(".status");

    updateButton(card,"yellow","Reset");

    status.textContent = "🟢 Cooking";

    updateTimer(card,"green");

    card.interval = setInterval(()=>{

        card.remaining--;

        timer.textContent = formatTime(card.remaining);

        // GREEN
        if(card.remaining > 10){

            updateTimer(card,"green");

            status.textContent = "🟢 Cooking";

        }

        // YELLOW
        else if(card.remaining > 0){

            updateTimer(card,"yellow");

            status.textContent = "🟡 Almost Done";

            updateButton(card,"yellow","Reset");

        }

        // DONE
        else{

            clearInterval(card.interval);

            card.interval = null;

            card.state = "done";

            timer.textContent = "DONE";

            updateTimer(card,"red");

            status.textContent = "🔴 Needs Attention";

            updateButton(card,"red","Acknowledge");

            card.classList.add("flash");

        }

    },1000);

}

function resetTimer(card){

    clearInterval(card.interval);

    card.interval = null;

    card.state = "ready";

    card.remaining = card.defaultTime;

    const timer = card.querySelector(".timer");
    const status = card.querySelector(".status");

    card.classList.remove("flash");

    timer.textContent = formatTime(card.defaultTime);

    updateTimer(card,"green");

    status.textContent = "🟢 Ready";

    updateButton(card,"green","Start");

}

function acknowledgeTimer(card){

    resetTimer(card);

}
// ========================================
// INITIALIZE ALL CARDS
// ========================================

document.querySelectorAll(".foodCard").forEach((card)=>{

    card.state = "ready";

    card.remaining = card.defaultTime;

    card.classList.remove("flash");

    const timer = card.querySelector(".timer");
    const status = card.querySelector(".status");

    timer.textContent = formatTime(card.defaultTime);

    updateTimer(card,"green");

    status.textContent = "🟢 Ready";

    updateButton(card,"green","Start");

});