'use strict';

document.addEventListener('DOMContentLoaded', function() {
    
    const card = document.getElementById('card');
    const form = document.getElementById('cardForm');
    const elementType = document.getElementById('elementType');
    const textGroup = document.getElementById('textGroup');
    const imgGroup = document.getElementById('imgGroup');
    const bgColor = document.getElementById('bgColor');
    const textColor = document.getElementById('textColor');
    const width = document.getElementById('width');
    const height = document.getElementById('height');
    const padding = document.getElementById('padding');
    const fontSize = document.getElementById('fontSize');
    const textInput = document.getElementById('textInput');
    const textCounter = document.getElementById('textCounter');
    const imgUrl = document.getElementById('imgUrl');
    const imgFile = document.getElementById('imgFile');
    const bgColorValue = document.getElementById('bgColorValue');
    const textColorValue = document.getElementById('textColorValue');
    const addElement = document.getElementById('addElement');
    const updateElement = document.getElementById('updateElement');
    const deleteElement = document.getElementById('deleteElement');
    const clearCard = document.getElementById('clearCard');

    let selectedElement = null;
    let fileImageData = null;
    const cardElements = [];
    
    initializeEventListeners();

    function initializeEventListeners() {
        elementType.addEventListener('change', toggleGroups);
        bgColor.addEventListener('input', updateColorDisplay);
        textColor.addEventListener('input', updateColorDisplay);
        textInput.addEventListener('input', updateTextCounter);
        imgFile.addEventListener('change', handleFileUpload);
        
        width.addEventListener('input', validateRange);
        height.addEventListener('input', validateRange);
        padding.addEventListener('input', validateRange);
        fontSize.addEventListener('input', validateRange);

        addElement.addEventListener('click', handleAddElement);
        updateElement.addEventListener('click', handleUpdateElement);
        deleteElement.addEventListener('click', handleDeleteElement);
        clearCard.addEventListener('click', handleClearCard);

        card.addEventListener('click', handleCardClick);
    }

    function toggleGroups() {
        const type = elementType.value;
        textGroup.classList.toggle('d-none', type !== 'text');
        imgGroup.classList.toggle('d-none', type !== 'img');
    }

    function updateColorDisplay() {
        bgColorValue.textContent = bgColor.value.toUpperCase();
        textColorValue.textContent = textColor.value.toUpperCase();
    }

    function updateTextCounter() {
        const length = textInput.value.length;
        textCounter.textContent = length;
        if (length >= 180) {
            textCounter.style.color = '#ff6b6b';
        } else if (length >= 150) {
            textCounter.style.color = '#ffa94d';
        } else {
            textCounter.style.color = 'inherit';
        }
    }

    function validateRange(e) {
        const input = e.target;
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        let value = parseInt(input.value);

        if (isNaN(value)) {
            value = parseInt(input.defaultValue || min);
        }

        if (value < min) input.value = min;
        if (value > max) input.value = max;
    }

    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) {
            fileImageData = null;
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('Arquivo muito grande! Máximo permitido: 5MB');
            imgFile.value = '';
            fileImageData = null;
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            fileImageData = event.target.result;
            imgUrl.value = '';
        };
        reader.readAsDataURL(file);
    }

    function getElementProperties() {
        return {
            type: elementType.value,
            text: textInput.value.trim(),
            img: fileImageData || imgUrl.value.trim(),
            bgColor: bgColor.value,
            textColor: textColor.value,
            width: parseInt(width.value),
            height: parseInt(height.value),
            padding: parseInt(padding.value),
            fontSize: parseInt(fontSize.value)
        };
    }

    function isValidProperties(props) {
        if (!props.type) {
            highlightField(elementType);
            return false;
        }

        if (props.type === 'text' && !props.text) {
            highlightField(textInput);
            return false;
        }

        if (props.type === 'img' && !props.img) {
            highlightField(imgUrl);
            return false;
        }

        return true;
    }

    function highlightField(field) {
        field.classList.remove('is-invalid');
        field.offsetHeight; // Trigger reflow
        field.classList.add('is-invalid');
        setTimeout(() => field.classList.remove('is-invalid'), 2000);
    }

    function createElementDOM(props, id) {
        let element;
        let zIndex = 1; // valor padrão

        if (props.type === 'div') {
            element = document.createElement('div');
            element.textContent = 'Caixa';
            zIndex = 1; // Fundo - menos importante
        } else if (props.type === 'text') {
            element = document.createElement('p');
            element.textContent = props.text;
            zIndex = 3; // Texto - mais importante
        } else if (props.type === 'img') {
            element = document.createElement('img');
            element.src = props.img;
            element.alt = 'Elemento de imagem do cartão';
            zIndex = 2; // Imagem - meio
        }

        if (element) {
            element.id = id;
            element.className = 'card-element';
            element.style.display = 'inline-block';
            element.style.position = 'relative';
            element.style.zIndex = zIndex;
            element.style.margin = '5px';
            element.style.padding = props.padding + 'px';
            element.style.width = props.width + 'px';
            element.style.height = props.height + 'px';
            element.style.backgroundColor = props.bgColor;
            element.style.color = props.textColor;
            element.style.fontSize = props.fontSize + 'px';
            element.style.overflow = 'hidden';
            element.style.wordWrap = 'break-word';
            element.style.boxSizing = 'border-box';

            if (props.type === 'img') {
                element.style.objectFit = 'cover';
            }
        }

        return element;
    }

    function handleAddElement() {
        const props = getElementProperties();

        if (!isValidProperties(props)) {
            return;
        }

        // Remove placeholder da primeira vez
        const placeholder = card.querySelector('p:not(.card-element)');
        if (placeholder) {
            placeholder.remove();
        }

        const id = 'element-' + Date.now();
        const element = createElementDOM(props, id);

        if (element) {
            card.appendChild(element);
            cardElements.push({ id, props });
        }

        resetForm();
    }

    function handleCardClick(e) {
        if (e.target === card || e.target.textContent === 'Adicione elementos para começar a criar seu cartão') {
            deselectElement();
            return;
        }

        const clickedElement = e.target.closest('.card-element');
        if (clickedElement) {
            selectElement(clickedElement);
        }
    }

    function selectElement(element) {
        if (selectedElement) {
            selectedElement.classList.remove('selected');
        }

        selectedElement = element;
        element.classList.add('selected');

        const elementData = cardElements.find(el => el.id === element.id);
        if (elementData) {
            populateFormFromElement(elementData.props);
            addElement.style.display = 'none';
            updateElement.style.display = 'block';
            deleteElement.style.display = 'block';
        }
    }

    function deselectElement() {
        if (selectedElement) {
            selectedElement.classList.remove('selected');
            selectedElement = null;
        }

        resetForm();
        addElement.style.display = 'block';
        updateElement.style.display = 'none';
        deleteElement.style.display = 'none';
    }

    function populateFormFromElement(props) {
        elementType.value = props.type;
        if (props.type === 'text') {
            textInput.value = props.text;
            updateTextCounter();
        } else if (props.type === 'img') {
            imgUrl.value = props.img;
            imgFile.value = '';
            fileImageData = null;
        }

        bgColor.value = props.bgColor;
        textColor.value = props.textColor;
        width.value = props.width;
        height.value = props.height;
        padding.value = props.padding;
        fontSize.value = props.fontSize;

        updateColorDisplay();
        toggleGroups();
    }

    function handleUpdateElement() {
        if (!selectedElement) return;

        const props = getElementProperties();
        if (!isValidProperties(props)) {
            return;
        }

        const elementData = cardElements.find(el => el.id === selectedElement.id);
        if (elementData) {
            elementData.props = props;

            if (props.type === 'text') {
                selectedElement.textContent = props.text;
            } else if (props.type === 'img') {
                selectedElement.src = props.img;
            }

            selectedElement.style.backgroundColor = props.bgColor;
            selectedElement.style.color = props.textColor;
            selectedElement.style.width = props.width + 'px';
            selectedElement.style.height = props.height + 'px';
            selectedElement.style.padding = props.padding + 'px';
            selectedElement.style.fontSize = props.fontSize + 'px';
        }
    }

    function handleDeleteElement() {
        if (!selectedElement) return;

        const id = selectedElement.id;
        selectedElement.remove();

        const index = cardElements.findIndex(el => el.id === id);
        if (index > -1) {
            cardElements.splice(index, 1);
        }

        if (card.children.length === 0) {
            card.innerHTML = '<p class="text-center text-muted mt-5"><em>Adicione elementos para começar a criar seu cartão</em></p>';
        }

        deselectElement();
    }

    function handleClearCard() {
        card.innerHTML = '<p class="text-center text-muted mt-5"><em>Adicione elementos para começar a criar seu cartão</em></p>';
        cardElements.length = 0;
        deselectElement();
        resetForm();
    }

    function resetForm() {
        form.reset();
        elementType.value = '';
        textInput.value = '';
        imgUrl.value = '';
        imgFile.value = '';
        fileImageData = null;
        bgColor.value = '#ffffff';
        textColor.value = '#000000';
        width.value = 150;
        height.value = 100;
        padding.value = 10;
        fontSize.value = 16;
        textCounter.textContent = '0';
        textCounter.style.color = 'inherit';
        updateColorDisplay();
        toggleGroups();
        addElement.style.display = 'block';
        updateElement.style.display = 'none';
        deleteElement.style.display = 'none';
    }
});