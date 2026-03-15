const stickerList = document.getElementById("sticker-list");
let selectedSticker = null;

const stickerImages = [
  "assets/stickers/bear.png",
  "assets/stickers/birthday-cupcake.png",
  "assets/stickers/cat-idea.png",
  "assets/stickers/chocolate.png",
  "assets/stickers/clock.png",
  "assets/stickers/easter-bunny.png",
  "assets/stickers/gilliterstar.png",
  "assets/stickers/hearts.png",
  "assets/stickers/moon.png",
  "assets/stickers/tomato-cat.png",
  "assets/stickers/bird-in-the-sky.png",
  "assets/stickers/coffee-cup.png",
  "assets/stickers/sunnysticker.png",
  "assets/stickers/mail.png"
]

// Load sticker panel
stickerImages.forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  img.className = "sticker-option";

  img.onclick = () => {
    // Toggle selection
    document.querySelectorAll('.sticker-option').forEach(s => s.classList.remove('selected'));
    
    if(selectedSticker === src) {
      selectedSticker = null; // Deselect if clicking same sticker
    } else {
      selectedSticker = src;
      img.classList.add('selected');
    }
  };

  stickerList.appendChild(img);
});

let currentDate = new Date();
let selectedDate = null;
let notes = JSON.parse(localStorage.getItem("pixel-notes") || "{}");

const themeSelect = document.getElementById("themeSelect");
const calendar = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");

const popup = document.getElementById("notePopup");
const popupNote = document.getElementById("popupNote");
const saveNoteBtn = document.getElementById("saveNote");
const closePopupBtn = document.getElementById("closePopup");

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const floatingContainer = document.getElementById("floating-art");

const floatingImages = [
  "assets/stickers/tomato-cat.png",
  "assets/stickers/hearts.png",
  "assets/stickers/bear.png",
  "assets/stickers/gilliterstar.png",
  "assets/stickers/clock.png",
  "assets/stickers/cat-idea.png",
  "assets/stickers/easter-bunny.png",
  "assets/stickers/birthday-cupcake.png"
];

function createFloatingSticker() {
  const img = document.createElement("img");
  img.src = floatingImages[Math.floor(Math.random() * floatingImages.length)];
  img.className = "floating-sticker";

  img.style.left = Math.random() * 100 + "vw";
  img.style.animationDuration = (8 + Math.random() * 5) + "s";

  floatingContainer.appendChild(img);

  setTimeout(() => img.remove(), 13000);
}

setInterval(createFloatingSticker, 2000);

function renderCalendar() {
  calendar.innerHTML = "";
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  monthLabel.textContent = monthNames[month] + " " + year;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  // Empty cells for days before month starts
  for(let i=0; i<firstDay; i++){
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  // Create day cells
  for(let day=1; day<=daysInMonth; day++){
    const dateKey = `${year}-${month}-${day}`;
    const div = document.createElement("div");
    div.className = "day";
    div.textContent = day;

    // Highlight if note exists
    if(notes[dateKey]) {
      div.style.background = "var(--hover-color)";
      div.style.color = "white";
    }

    // Show sticker if exists
    const stickerSrc = notes[dateKey + "_sticker"];
    if(stickerSrc){
      const stickerImg = document.createElement("img");
      stickerImg.src = stickerSrc;
      stickerImg.className = "date-sticker";
      div.style.position = "relative";
      div.appendChild(stickerImg);
    }

    // Single click handler
    div.onclick = (e) => {
      selectedDate = dateKey;

      // If sticker is selected, place it on this date
      if(selectedSticker){
        notes[dateKey + "_sticker"] = selectedSticker;
        localStorage.setItem("pixel-notes", JSON.stringify(notes));
        
        // Deselect sticker after placing
        selectedSticker = null;
        document.querySelectorAll('.sticker-option').forEach(s => s.classList.remove('selected'));
        
        renderCalendar();
        
        // Sparkle effect at click location
        createSparkles(e.clientX, e.clientY);
        return; // Don't open note popup when placing sticker
      }

      // Otherwise, open note popup
      popup.classList.remove("hidden");
      popupNote.value = notes[dateKey] || "";
      
      // Sparkle effect
      createSparkles(e.clientX, e.clientY);
    };

    // Magnetic hover effect
    div.addEventListener("mousemove", (e) => {
      const rect = div.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      div.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.2)`;
    });

    div.addEventListener("mouseleave", () => {
      div.style.transform = "translate(0px, 0px) scale(1)";
    });

    calendar.appendChild(div);
  }
}

// Sparkle effect helper function
function createSparkles(x, y) {
  for(let i = 0; i < 6; i++){
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }
}

// Save note button
saveNoteBtn.onclick = () => {
  if(selectedDate){
    notes[selectedDate] = popupNote.value;
    localStorage.setItem("pixel-notes", JSON.stringify(notes));
    popup.classList.add("hidden");
    renderCalendar();
  }
};

// Close popup button
closePopupBtn.onclick = () => {
  popup.classList.add("hidden");
};

// Month navigation
function prevMonth(){
  currentDate.setMonth(currentDate.getMonth()-1);
  renderCalendar();
}

function nextMonth(){
  currentDate.setMonth(currentDate.getMonth()+1);
  renderCalendar();
}

// Theme switching
themeSelect.addEventListener("change", () => {
  document.body.classList.remove("pink","lavender","mint","yellow");
  document.body.classList.add(themeSelect.value);
});

// Make functions globally accessible
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;

// Drag Widget
dragElement(document.getElementById("widget"));
function dragElement(el) {
  let pos1=0, pos2=0, pos3=0, pos4=0;
  const header = el.querySelector('h2');
  
  if(header) {
    header.onmousedown = dragMouseDown;
  } else {
    el.onmousedown = dragMouseDown;
  }
  
  function dragMouseDown(e){
    e.preventDefault();
    pos3=e.clientX; 
    pos4=e.clientY;
    document.onmouseup=closeDragElement;
    document.onmousemove=elementDrag;
  }
  
  function elementDrag(e){
    e.preventDefault();
    pos1=pos3-e.clientX;
    pos2=pos4-e.clientY;
    pos3=e.clientX; 
    pos4=e.clientY;
    el.style.top=(el.offsetTop-pos2)+"px";
    el.style.left=(el.offsetLeft-pos1)+"px";
    el.style.position="absolute";
  }
  
  function closeDragElement(){
    document.onmouseup=null;
    document.onmousemove=null;
  }
}

// PDF Export
function exportPDF(){
  window.print();
}

window.exportPDF = exportPDF;

// Initial render
renderCalendar();
