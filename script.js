// Obtém os elementos do DOM necessários
const nameList = document.getElementById('nameList'); // Lista de nomes (maquinistas)
const spaces = document.querySelectorAll('.space'); // Seleciona todos os espaços onde os nomes podem ser arrastados
const addButton = document.getElementById('addButton'); // Botão para adicionar novos maquinistas
const newMaquinistaInput = document.getElementById('newMaquinista'); // Campo de entrada para o novo maquinista
const menuLi = document.querySelectorAll('.menu-li');

// ------------------- Adicionando o aprimoramento -------------------
// Função para iniciar ou reiniciar o timer
function toggleTimer(nameElement, startButton) {
    const timeSpan = nameElement.querySelector('span'); // Obtém o elemento de tempo
    const currentTime = new Date(); // Obtém o tempo atual

    // Se o botão já estiver ativo, reinicia o timer
    if (startButton.classList.contains('clicked')) {
        clearTimeout(timers[nameElement.innerText]); // Limpa o timer existente
        timeSpan.innerText = ''; // Limpa o texto de tempo
        startButton.classList.remove('clicked'); // Remove a classe de clique
        startButton.innerText = 'Início'; // Restaura o texto do botão
        nameElement.querySelector('.availabilityMessage').innerText = ''; // Limpa a mensagem de disponibilidade
    } else {
        // Se o botão não estiver ativo, inicia um novo timer
        const endTime = new Date(currentTime.getTime() + 30 * 1000); // Define o tempo de fim para 30 segundos a partir de agora
        const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Função para formatar o tempo

        startButton.classList.add('clicked'); // Adiciona a classe de clique
        startButton.innerText = 'Fora'; // Muda o texto do botão
        timeSpan.innerText = `${formatTime(currentTime)} - ${formatTime(endTime)}`; // Exibe o tempo inicial e final

        // Configura o timer para alterar a exibição após 30 segundos
        timers[nameElement.innerText] = setTimeout(() => {
            startButton.style.display = 'none'; // Oculta o botão de iniciar
            timeSpan.innerText = ''; // Limpa o texto de tempo
            nameElement.querySelector('.availabilityMessage').innerText = `Disponível às ${formatTime(endTime)}`; // Exibe a mensagem PRONTO
        }, 30 * 1000); // Timer de 30 segundos
    }
}



// Função para mostrar a seção correspondente
function showSpace(event) {
    const localId = event.currentTarget.getAttribute('data-local'); // Obtém o ID da seção a ser mostrada

    // Esconde todas as seções de conteúdo
    const space = document.querySelectorAll('.spacesContainer');
    space.forEach(space => {
        space.style.display = 'none'; // Esconde a seção
    });

    // Mostra a seção correspondente ao botão clicado
    const spacesContainer = document.getElementById(localId);
    if (spacesContainer) {
        spacesContainer.style.display = 'block'; // Exibe a seção
    }
}

// Adiciona ouvintes de eventos a cada botão do menu
menuLi.forEach(li => {
    li.addEventListener('click', showSpace); // Executa a função ao clicar no botão
});


//------------------- Variável para armazenar timers ativos----------------------
let timers = {};

// Função para iniciar o arrasto
function dragStart(e) {
    // Define o texto a ser arrastado
    e.dataTransfer.setData('text/plain', e.target.innerText);
}

// Função para permitir o arrasto
function dragOver(e) {
    // Previne o comportamento padrão para permitir o drop
    e.preventDefault();
}

// Função para lidar com o drop
function drop(e) {
    // Previne o comportamento padrão
    e.preventDefault();
    // Obtém o nome do maquinista arrastado
    const name = e.dataTransfer.getData('text/plain');

    // Verifica se o nome já está em uso neste espaço
    const alreadyInSpace = Array.from(this.querySelector('.dropped-names').children).some(child => child.innerText.includes(name));
    // Verifica se o nome já está ocupado em qualquer espaço
    const isNameOccupied = Array.from(spaces).some(space => 
        Array.from(space.querySelector('.dropped-names').children).some(child => child.innerText.includes(name))
    );

    // Se o nome não estiver em uso, cria um novo elemento para o nome
    if (!alreadyInSpace && !isNameOccupied) {
        const nameElement = document.createElement('div'); // Cria um novo elemento para o nome
        nameElement.className = 'droppedName'; // Define a classe do elemento

        // Index para numerar os nomes
        const index = this.querySelector('.dropped-names').children.length + 1;
        nameElement.innerText = `${index}. ${name}`; // Define o texto do elemento

        const list = document.createElement('div'); // Cria um contêiner para botões
        list.style.display = 'flex'; // Define a exibição como flexível
        list.style.alignItems = 'center'; // Alinha os itens ao centro

        // Cria o botão de iniciar a refeição
        const startButton = document.createElement('button');
        startButton.innerText = 'Início'; // Texto do botão
        startButton.className = 'startButton'; // Classe do botão
        startButton.addEventListener('click', () => toggleTimer(nameElement, startButton)); // Adiciona evento de clique

        // Cria o botão de remover
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Sair'; // Texto do botão
        removeButton.className = 'removeButton'; // Classe do botão

        // Evento para remover o nome quando clicado
        removeButton.addEventListener('click', () => {
            nameElement.remove(); // Remove o elemento de nome
        });

        const timeSpan = document.createElement('span'); // Cria um elemento para mostrar o tempo
        list.appendChild(startButton); // Adiciona o botão de iniciar à lista
        list.appendChild(removeButton); // Adiciona o botão de remover à lista
        list.appendChild(timeSpan); // Adiciona o elemento de tempo à lista
        nameElement.appendChild(list); // Adiciona a lista ao elemento de nome

        // Cria uma mensagem de disponibilidade "PRONTO"
        const availabilityMessage = document.createElement('div');
        availabilityMessage.className = 'availabilityMessage'; // Classe da mensagem
        availabilityMessage.style.marginLeft = '7px'; // Margem à esquerda
        list.appendChild(availabilityMessage); // Adiciona a mensagem à lista

        // Adiciona o elemento de nome ao espaço de destino
        this.querySelector('.dropped-names').appendChild(nameElement);
    }
}

// Evento de arrasto para os nomes
const names = nameList.querySelectorAll('li'); // Seleciona todos os nomes na lista
names.forEach(name => {
    name.addEventListener('dragstart', dragStart); // Adiciona evento de arrasto a cada nome
});

// Evento para adicionar novos maquinistas
addButton.addEventListener('click', () => {
    const newName = newMaquinistaInput.value.trim(); // Obtém o valor do campo de entrada
    if (newName) {
        const li = document.createElement('li'); // Cria um novo elemento de lista para o maquinista
        li.innerText = newName; // Define o texto do elemento
        li.draggable = true; // Torna o elemento arrastável
        li.addEventListener('dragstart', dragStart); // Adiciona evento de arrasto
        
        // Adiciona o nome à lista
        nameList.appendChild(li); // Adiciona o novo nome à lista
        newMaquinistaInput.value = ''; // Limpa o campo de entrada
    }
});

// Permite que o espaço aceite o arrasto
spaces.forEach(space => {
    space.addEventListener('drop', drop); // Adiciona evento de drop ao espaço
    space.addEventListener('dragover', dragOver); // Adiciona evento de arrasto sobre o espaço
});





//---------------------           C  H  A  T    -----------
// Lista de administradores
// Lista de administradores
const admins = {
    "Recepção": "ccp2024",
    "Formação": "ccp2024",
    "Classificação": "ccp2024"
};

let currentUser = ""; // Variável para armazenar o usuário atual

document.getElementById("login-button").addEventListener("click", function() {
    const selectedAdminName = document.getElementById("login-name").value.trim();  // Nome do admin selecionado
    const password = document.getElementById("login-password").value.trim();  // Senha para admin
    const commonUserName = document.getElementById("user-name").value.trim(); // Nome do usuário comum

    // Verifica se o usuário é um administrador
    if (selectedAdminName && password && selectedAdminName in admins && password === admins[selectedAdminName]) {
        currentUser = selectedAdminName;
        localStorage.setItem("user", selectedAdminName);
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("chat-container").style.display = "flex";
        greetUser(selectedAdminName, true);
    }
    // Verifica se é um usuário comum (sem senha)
    else if (commonUserName !== "") {
        currentUser = commonUserName;
        localStorage.setItem("user", commonUserName);
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("chat-container").style.display = "flex";
        greetUser(commonUserName, false);
    } else {
        alert("Por favor, insira seu nome e senha (se for admin) para entrar.");
    }
});

// Função para exibir saudação no chat
function greetUser(userName, isAdmin) {
    const chatBox = document.getElementById("chat-box");
    const welcomeMessage = document.createElement("div");
    welcomeMessage.classList.add("message", "received");
    welcomeMessage.textContent = `Bem-vindo ao chat, ${isAdmin ? `Admin: ${userName}` : userName}!`;
    chatBox.appendChild(welcomeMessage);
    scrollToBottom();
}

// Enviar mensagens
document.getElementById("send-button").addEventListener("click", function() {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value.trim();

    if (messageText === "") {
        return;
    }

    const chatBox = document.getElementById("chat-box");
    const message = document.createElement("div");
    message.classList.add("message", "sent");

    // Formatação para administradores e usuários
    if (currentUser in admins) {
        // Mensagem de administrador, nome em vermelho e negrito
        message.innerHTML = `<span class="admin">${currentUser}:</span> ${messageText}`;
        document.getElementById("admin-sound").play();  // Reproduz som para administradores
    } else {
        // Mensagem de usuário comum
        message.innerHTML = `<span class="user">${currentUser}:</span> ${messageText}`;
    }

    chatBox.appendChild(message);
    messageInput.value = ""; // Limpa o campo de input
    scrollToBottom();
});

document.getElementById("message-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        document.getElementById("send-button").click();
    }
});

// Função para rolar para a última mensagem
function scrollToBottom() {
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}
