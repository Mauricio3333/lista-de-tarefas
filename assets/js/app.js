const inputAddTarefa = document.getElementById("inputAddTarefa");
const listaDeTarefas = document.getElementById("listaDeTarefas");
const inputSearch = document.querySelector(".pesquisar");
const lupa = document.getElementById("lupa");
const closeInput = document.getElementById("clearButton")

// Função para carregar tarefas do localStorage
const carregarTarefas = () => {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefas.forEach(tarefa => {
        listaDeTarefas.appendChild(criarElementos(tarefa));
    });
};

// Função para criar elementos de tarefa
const criarElementos = ({ texto, realizado, dataHora }) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.setAttribute('data-datetime', dataHora);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = realizado;
    checkbox.addEventListener('click', marcarTarefaRealizada );

    const spanTexto = document.createElement('span');
    spanTexto.className = 'texto';
    spanTexto.textContent = capitalizeFirstLetter(texto);
    if (realizado) {
        spanTexto.classList.add("marcarTexto");
        li.classList.add("opc")
    }

    // const iconSpan = document.createElement('span');
    // iconSpan.className = 'icon';

    const icon = document.createElement('ion-icon');
    icon.setAttribute("name", "close-outline");
    icon.className = "remover" 
    icon.addEventListener('click', excluirTarefa );

    // iconSpan.appendChild(icon);

    li.appendChild(checkbox);
    li.appendChild(spanTexto);
    // li.appendChild(iconSpan);
    li.appendChild(icon)

    return li;
};

// Função para adicionar tarefa
const adicionarTarefa = (e) => {
    e.preventDefault()
    const tarefaTexto = inputAddTarefa.value.trim();
    if (!tarefaTexto) {
        alert("Tarefa vazia, adicione algo!");
        return;
    }

    if (verificarTarefaExistente(tarefaTexto)) {
        alert("Essa tarefa já foi adicionada!");
        return;
    }

    const tarefa = { texto: tarefaTexto, realizado: false, dataHora: obterDataHoraAtual() };
    listaDeTarefas.appendChild(criarElementos(tarefa));
    inputAddTarefa.value = '';
    salvarTarefas();
};

// Função para verificar se a tarefa já existe
const verificarTarefaExistente = (textoNovaTarefa) => {
    return Array.from(document.querySelectorAll(".texto"))
        .some(item => item.textContent.toLowerCase() === textoNovaTarefa.toLowerCase());
};

// Função para salvar tarefas no localStorage
const salvarTarefas = () => {
    const tarefas = Array.from(document.querySelectorAll(".item")).map(item => ({
        texto: item.querySelector(".texto").textContent,
        realizado: item.querySelector(".checkbox").checked,
        dataHora: item.getAttribute("data-datetime")
    }));
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

// Função para marcar tarefa como realizada
const marcarTarefaRealizada  = (e) => {
    e.target.parentNode.classList.toggle("opc")
    e.target.nextElementSibling.classList.toggle("marcarTexto")
    salvarTarefas();
};

// Função para excluir tarefa
const excluirTarefa  = (e) => {
    e.target.closest('.item').remove();
    salvarTarefas();
};

// Função para obter a data e hora atual
const obterDataHoraAtual = () => {
    return new Date().toLocaleString();
};

// Função para deletar todas as tarefas
const deletarTudo = () => { 
    if (listaDeTarefas.children.length > 0 && confirm("Tem certeza, que quer deletar tudo?")) {
        listaDeTarefas.textContent = "";
        esconderCampoPesquisa()
        salvarTarefas();

    }else if(listaDeTarefas.children.length <= 0){
        alert("Não tem tarefas para excluir!");
    }
};

// Função para filtrarTarefa tarefas
const filtrarTarefa = () => {
    const textoProcurado = inputSearch.value.toLowerCase();
    document.querySelectorAll(".item").forEach(item => {
        const textoItem = item.querySelector(".texto").textContent.toLowerCase();
        item.style.display = textoItem.includes(textoProcurado) ? 'flex' : 'none';
    });
};

// Função para mostrar o campo de pesquisa
const mostrarCampoPesquisa = () => {
    inputSearch.focus()
    inputSearch.classList.add("aparecer");
    closeInput.style.visibility = "visible"
    closeInput.style.opacity = 1
    lupa.style.transform = "scale(3.0)";
    lupa.style.opacity = 0;
    lupa.style.visibility = "hidden";
    
};

// Função para esconder o campo de pesquisa
const esconderCampoPesquisa = () => {
    inputSearch.classList.remove("aparecer");
    closeInput.style.visibility = "hidden"
    closeInput.style.opacity = 0
    inputSearch.value = "";
    lupa.style.transform = "scale(1.0)";
    lupa.style.visibility = "visible";
    lupa.style.opacity = 1;
    filtrarTarefa()
};

// Função para capitalizar a primeira letra de um texto
const capitalizeFirstLetter = (texto) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
};

// Eventos
inputAddTarefa.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') adicionarTarefa(e);
});

lupa.addEventListener("click", mostrarCampoPesquisa);
inputSearch.addEventListener("input", filtrarTarefa);
closeInput.addEventListener("click", esconderCampoPesquisa);
window.addEventListener("load", carregarTarefas);
