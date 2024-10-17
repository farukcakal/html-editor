// HTML öğelerini sürükleme
const draggables = document.querySelectorAll('.draggable');
const editor = document.getElementById('editor');
const htmlOutput = document.getElementById('htmlOutput'); // HTML çıktısını yazacağımız alan
const preview = document.getElementById('preview'); // Önizleme yapacağımız alan
let draggedElement = null;  // Sürüklenen öğeyi takip etmek için değişken

draggables.forEach(item => {
    item.addEventListener('dragstart', dragStart);
});

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-type'));
}

// Editör alanı üzerine sürükleme ve bırakma olayları
editor.addEventListener('dragover', dragOver);
editor.addEventListener('drop', drop);

function dragOver(e) {
    e.preventDefault();  // Varsayılan davranışı engelle
}

function drop(e) {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text/plain');
    const dropTarget = e.target;

    let newElement;

    // Element tipini kontrol ederek uygun yapıyı ekleme
    if (elementType === 'row') {
        newElement = document.createElement('div');
        newElement.classList.add('row', 'element');
        newElement.setAttribute('draggable', 'true');
        addDeleteButton(newElement);
        addDragEvents(newElement);
    } else if (elementType === 'col') {
        newElement = document.createElement('div');
        newElement.classList.add('col', 'element');
        newElement.setAttribute('draggable', 'true');
        addDeleteButton(newElement);
        addDragEvents(newElement);
    } else if (elementType === 'p') {
        newElement = document.createElement('p');
        newElement.textContent = 'Bu bir paragraf';
        newElement.classList.add('element');
        newElement.setAttribute('draggable', 'true');
        addDeleteButton(newElement);
        addDragEvents(newElement);
    } else if (elementType === 'h1') {
        newElement = document.createElement('h1');
        newElement.textContent = 'Bu bir Başlık 1';
        newElement.classList.add('element');
        newElement.setAttribute('draggable', 'true');
        addDeleteButton(newElement);
        addDragEvents(newElement);
    } else if (elementType === 'img') {
        const imgContainer = document.createElement('div'); // Resmi içine koymak için bir div oluştur
        imgContainer.classList.add('element');  // Stil için class ekle
        imgContainer.style.position = 'relative';  // Sil butonunu konumlandırabilmek için relative yapıyoruz
    
        const imgElement = document.createElement('img');
        imgElement.src = 'https://pbs.twimg.com/profile_images/763817533908582400/LzzU3vfp_400x400.jpg';
        imgElement.alt = 'Placeholder image';
        imgElement.style.maxWidth = '100%';  // Resmi taşırmamak için max-width veriyoruz
        imgElement.style.height = 'auto';  // Yükseklik otomatik olsun
    
        imgContainer.appendChild(imgElement);  // Resmi kapsayıcıya ekle
        addDeleteButton(imgContainer);  // Kapsayıcıya sil butonu ekle
        addDragEvents(imgContainer);  // Sürükleme olayları ekle
        newElement = imgContainer;  // Oluşturulan öğeyi yeni element olarak ayarla
    }

    // Yeni öğeyi uygun hedefe ekle
    if (newElement) {
        // Eğer hedef bir `row` ise, sadece `col` ekle
        if (dropTarget.classList.contains('row') && elementType === 'col') {
            dropTarget.appendChild(newElement);
        }
        // Eğer hedef `col` ise, içerisine her şey eklenebilir
        else if (dropTarget.classList.contains('col')) {
            dropTarget.appendChild(newElement);
        }
        // Eğer ana editöre sürüklendiyse (boş alana), sadece `row` eklenebilir
        else if (elementType === 'row') {
            editor.appendChild(newElement);
        }

        updateHtmlOutput();  // HTML çıktısını güncelle
    }
}

// HTML çıktısını textarea'ya ve preview alanına aktarma
function updateHtmlOutput() {
    const editorClone = editor.cloneNode(true);  // Editörün klonunu oluştur
    removeDeleteButtons(editorClone);  // Klon içerisindeki sil butonlarını kaldır
    const htmlContent = editorClone.innerHTML.trim();  // Sil butonları olmadan HTML içeriği al
    htmlOutput.value = htmlContent;  // textarea'ya aktar
    preview.innerHTML = htmlContent;  // önizleme alanına aktar
}

// Editörün klonundan sil butonlarını kaldıran fonksiyon
function removeDeleteButtons(element) {
    const deleteButtons = element.querySelectorAll('button');
    deleteButtons.forEach(button => button.remove());  // Tüm sil butonlarını kaldır
}

// Silme düğmesi ekleme fonksiyonu
function addDeleteButton(element) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.classList.add('delete-btn'); // Sil butonuna class ekleyelim
    deleteBtn.addEventListener('click', function() {
        element.remove();  // Elementi DOM'dan kaldır
        updateHtmlOutput();  // HTML çıktısını güncelle
    });
    element.appendChild(deleteBtn);  // Silme düğmesini öğeye ekle
}

// Sürükle bırak olaylarını elementlere ekleme
function addDragEvents(element) {
    element.addEventListener('dragstart', function (e) {
        draggedElement = e.target;
        setTimeout(() => {
            e.target.style.display = 'none';  // Sürüklenirken görünmez yap
        }, 0);
    });

    element.addEventListener('dragend', function (e) {
        setTimeout(() => {
            e.target.style.display = 'block';  // Sürükleme bittiğinde tekrar göster
            draggedElement = null;
        }, 0);
    });

    element.addEventListener('dragover', function (e) {
        e.preventDefault();  // Sürüklenen öğenin bırakılmasına izin ver
    });

    element.addEventListener('drop', function (e) {
        e.preventDefault();
        if (draggedElement !== this) {
            // Sürüklenen öğeyi hedefin önüne ekle
            this.parentNode.insertBefore(draggedElement, this);
        }
        updateHtmlOutput();  // HTML çıktısını güncelle
    });
}