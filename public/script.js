function customAlert(message, type = "info") {
        return new Promise((resolve) => {
            let oldAlert = document.getElementById("customAlertOverlay");
            if (oldAlert) oldAlert.remove();
    
            let overlay = document.createElement("div");
            overlay.id = "customAlertOverlay";
            overlay.classList.add("custom-alert-overlay");
    
            let alertBox = document.createElement("div");
            alertBox.classList.add("custom-alert", `custom-alert-${type}`);
            alertBox.innerHTML = `
                <p>${message}</p>
                <button id="alertOkButton">OK</button>
            `;
    
            overlay.appendChild(alertBox);
            document.body.appendChild(overlay);
    
            let alertButton = alertBox.querySelector("#alertOkButton");
            alertButton.style.background = "white";
            alertButton.style.color = "black";
            alertButton.style.fontWeight = "bold";
            alertButton.style.padding = "10px 20px";
            alertButton.style.borderRadius = "8px";
            alertButton.style.cursor = "pointer";
            alertButton.style.border = "none";
            alertButton.style.fontSize = "16px";
    
            alertButton.addEventListener("mouseover", () => {
                alertButton.style.background = "#e0e0e0";
            });
    
            alertButton.addEventListener("mouseout", () => {
                alertButton.style.background = "white";
            });
    
            document.getElementById("alertOkButton").addEventListener("click", () => {
                overlay.remove();
                resolve(); 
            });
        });
    }    
    
    function closeCustomAlert() {
        const alertBox = document.getElementById("customAlert");
        if (alertBox) {
            alertBox.remove();
            if (alertBox.callback) alertBox.callback();
        }
    }
    
    async function criarNovaConta() {
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();
        const data_criacao = new Date().toISOString().split('T')[0];

        if (!nome || !email || !senha || !confirmarSenha) {
           await customAlert("Preencha todos os campos!");
            return;
        }

        if (senha !== confirmarSenha) {
            await customAlert("As senhas não coincidem!");
            return;
        }

        const resposta = await fetch('http://localhost:3000/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha, data_criacao })
        });

        const data = await resposta.json();

        if (resposta.ok) {
            await customAlert("Conta criada com sucesso!");
            window.location.href = "entrar.html";
        } else {
            await customAlert(data.message || "Erro ao criar conta.");
        }
    }

    async function entrar() {
        const email = document.getElementById('login').value.trim();
        const senha = document.getElementById('senha').value.trim();

        if (!email || !senha) {
            await customAlert("Por favor, preencha todos os campos!");
            return;
        }

        const resposta = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await resposta.json();

        if (resposta.ok) {
            localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
            await customAlert("Login realizado com sucesso!");
            window.location.href = "inicio.html";
        } else {
            await customAlert(data.message || "Erro ao fazer login.");
        }
    }

    function voltarLogin() {
        window.location.href = "entrar.html";
    }

    async function savePassword() {
        const novaSenha = document.getElementById('password').value.trim();
    
        if (novaSenha.length < 6) {
            await customAlert("A senha deve ter pelo menos 6 caracteres.");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/alterar-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senha: novaSenha })
            });
    
            const data = await response.json();
            await customAlert(data.message);
            
            document.getElementById('password').value = ""; 
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            await customAlert("Erro ao alterar senha. Tente novamente.");
        }
    }    

    async function salvarDespesa() {
        const descricao = document.getElementById('titulo').value.trim();
        const valor = document.getElementById('valor_despesa').value.trim();
        const data_pagamento = document.getElementById('data_inicio').value;
        const categoria = document.getElementById('categoria').value;
    
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!usuarioLogado || !usuarioLogado.id) {
            await customAlert("Usuário não autenticado.", "error");
            return;
        }
        const id_usuario = usuarioLogado.id; 
    
        if (!descricao || !valor || !data_pagamento || !categoria) {
            await customAlert("Preencha todos os campos!");
            return;
        }
    
        try {
            const resposta = await fetch('http://localhost:3000/despesa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario, descricao, valor, data_pagamento, categoria })
            });
    
            const data = await resposta.json();
    
            if (resposta.ok) {
                await customAlert("Despesa adicionada com sucesso!");
                window.location.href = "inicio.html";
            } else {
                await customAlert(data.message || "Erro ao adicionar despesa.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            await customAlert("Erro ao conectar com o servidor. Verifique a conexão.");
        }
    }
    
    async function salvarReceita() {
        const descricao = document.getElementById('titulo').value.trim();
        const valor = document.getElementById('valor_receita').value.trim();
        const data_recebimento = document.getElementById('data_inicio').value;
        const categoria = document.getElementById('categoria').value;
    
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!usuarioLogado || !usuarioLogado.id) {
            await customAlert("Usuário não autenticado.", "error");
            return;
        }
        const id_usuario = usuarioLogado.id;
    
        if (!descricao || !valor || !data_recebimento || !categoria) {
            await customAlert("Preencha todos os campos!");
            return;
        }
    
        try {
            const resposta = await fetch('http://localhost:3000/receita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario, descricao, valor, data_recebimento, categoria })
            });
    
            const data = await resposta.json();
    
            if (resposta.ok) {
                await customAlert("Receita adicionada com sucesso!");
                window.location.href = "inicio.html";
            } else {
                await customAlert(data.message || "Erro ao adicionar receita.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            await customAlert("Erro ao conectar com o servidor. Verifique a conexão.");
        }
    }    

    async function salvarMeta() {
        const titulo = document.getElementById('titulo').value.trim();
        const valor_meta = document.getElementById('valor_meta').value.trim();
        const valor_acumulado = document.getElementById('valor_acumulado').value.trim();
        const data_inicio = document.getElementById('data_inicio').value;
        const data_fim = document.getElementById('data_fim').value;
    
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!usuarioLogado || !usuarioLogado.id) {
            await customAlert("Usuário não autenticado.", "error");
            return;
        }
        const id_usuario = usuarioLogado.id; 
    
        if (!titulo || !valor_meta || !valor_acumulado || !data_inicio || !data_fim) {
            await customAlert("Preencha todos os campos!");
            return;
        }
    
        try {
            const resposta = await fetch('http://localhost:3000/meta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario, titulo, valor_meta, valor_acumulado, data_inicio, data_fim })
            });
    
            const data = await resposta.json();
    
            if (resposta.ok) {
                await customAlert("Meta adicionada com sucesso!");
                window.location.href = "inicio.html";
            } else {
                await customAlert(data.message || "Erro ao adicionar meta.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            await customAlert("Erro ao conectar com o servidor. Verifique a conexão.");
        }
    }    

    async function gerarRelatorio() {
        const dataInicio = document.getElementById('data_inicio').value;
        const dataFim = document.getElementById('data_fim').value;
        const tabela = document.getElementById('tabela-relatorio');
        const corpoTabela = document.getElementById('corpo-relatorio');

        if (!dataInicio || !dataFim) {
            await customAlert("Por favor, selecione um período válido.");
            return;
        }

        console.log("Consultando relatório...");

        try {
            const resposta = await fetch(`http://localhost:3000/relatorio?data_inicio=${dataInicio}&data_fim=${dataFim}`);
            const dados = await resposta.json();

            corpoTabela.innerHTML = "";

            if (dados.length > 0) {
                dados.forEach(d => {
                    let row = `<tr>
                        <td>${d.data}</td>
                        <td>${d.descricao}</td>
                        <td>R$ ${d.valor}</td>
                        <td>${d.categoria}</td>
                    </tr>`;
                    corpoTabela.innerHTML += row;
                });

                tabela.style.display = "table";
            } else {
                await customAlert("Nenhuma despesa encontrada no período selecionado.");
                tabela.style.display = "none";
            }

        } catch (error) {
            console.error("Erro ao buscar relatório:", error);
            await customAlert("Erro ao conectar com o servidor.");
        }
    }

    async function carregarUsuario() {
        try {
            const resposta = await fetch('http://localhost:3000/usuario-logado');
            const data = await resposta.json();

            if (resposta.ok) {
                document.getElementById('profile-btn').textContent = data.nome;
            } else {
                document.getElementById('profile-btn').textContent = "Usuário";
            }
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        }
    }

    document.addEventListener("DOMContentLoaded", carregarUsuario);

    async function carregarCategorias() {
        try {
            const resposta = await fetch('http://localhost:3000/categorias-despesas');
            const categorias = await resposta.json();
    
            console.log("Categorias carregadas:", categorias);
    
            const container = document.getElementById('categorias-container');
            container.innerHTML = "";
    
            if (categorias.length === 0) {
                console.warn("Nenhuma categoria encontrada.");
                container.innerHTML = "<p style='color: white; text-align: center;'>Nenhuma categoria registrada.</p>";
                return;
            }
    
            categorias.forEach(categoria => {
                const div = document.createElement('div');
                div.classList.add('category');
                div.style.backgroundColor = categoria.cor;
                div.innerHTML = `${categoria.nome}<br>${categoria.percentual}%`;
                container.appendChild(div);
            });
    
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    }
    
    document.addEventListener("DOMContentLoaded", carregarCategorias);

    async function carregarGraficoPizza() {
        try {
            const resposta = await fetch('http://localhost:3000/dados-grafico');
            const dados = await resposta.json();
    
            console.log("Dados do gráfico carregados:", dados);
    
            const saldo = dados.saldo;
            const categorias = dados.categorias;
    

            function formatarSaldo(saldo) {
                return saldo % 1 === 0 ? `R$${saldo.toFixed(0)}` : `R$${saldo.toFixed(2)}`;
            }
    
            document.querySelector('.chart-center').innerHTML = `
                <span style="display: block; font-size: 1.0em;">Saldo:</span>
                <span style="font-size: 1.0em;">${formatarSaldo(saldo)}</span>
            `;
    
            const chartElement = document.getElementById('financeChart');
            chartElement.style.display = 'block'; 
    
            if (chartElement.chart) {
                chartElement.chart.destroy();
            }
    
            const ctx = chartElement.getContext('2d');
    
            if (!categorias || categorias.length === 0 || categorias.every(c => c.total_gasto === 0)) {
                console.warn("Nenhuma categoria com gastos encontrados. Exibindo gráfico vazio.");
    
                chartElement.chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Sem Gastos'],
                        datasets: [{
                            data: [1], 
                            backgroundColor: ['#ccc'] 
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        cutout: '60%'
                    }
                });
    
                return;
            }
    
            const labels = categorias.map(c => c.nome);
            const valores = categorias.map(c => c.total_gasto);
            const cores = categorias.map(c => c.cor);
    
            chartElement.chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: cores
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false,
                            external: function(context) {
                                let tooltipEl = document.getElementById('chartjs-tooltip');
                        
                                if (!tooltipEl) {
                                    tooltipEl = document.createElement('div');
                                    tooltipEl.id = 'chartjs-tooltip';
                                    tooltipEl.innerHTML = '<div class="tooltip-content"></div>';
                                    document.body.appendChild(tooltipEl);
                                }
                        
                                const tooltipModel = context.tooltip;
                        
                                if (tooltipModel.opacity === 0) {
                                    tooltipEl.style.opacity = 0;
                                    return;
                                }
                        
                                const dataPoint = tooltipModel.dataPoints[0];
                                const categoria = dataPoint.label;
                                const valor = `R$${dataPoint.raw.toFixed(2)}`;
                                const corCategoria = context.chart.data.datasets[0].backgroundColor[dataPoint.dataIndex];
                        
                                tooltipEl.querySelector('.tooltip-content').innerHTML = `
                                    <strong>${categoria}</strong><br>${valor}
                                `;
                        
                                tooltipEl.style.backgroundColor = corCategoria;
                                tooltipEl.style.border = "2px solid white"; 
                        
                                const chartElement = context.chart.canvas;
                                const chartRect = chartElement.getBoundingClientRect();
                        
                                tooltipEl.style.opacity = 1;
                                tooltipEl.style.left = `${chartRect.left + chartRect.width / 2}px`; 
                                tooltipEl.style.top = `${chartRect.bottom + 20}px`;
                                tooltipEl.style.transform = "translateX(-50%)"; 
                                tooltipEl.style.position = "absolute";
                            }
                        }                                       
                    },
                    cutout: '60%'
                }
            });
    
        } catch (error) {
            console.error("Erro ao carregar gráfico de pizza:", error);
        }
    }
    
    document.addEventListener("DOMContentLoaded", carregarGraficoPizza);    
    
    async function gerarRelatorio() {
        const dataInicio = document.getElementById('data_inicio').value;
        const dataFim = document.getElementById('data_fim').value;
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
        if (!dataInicio || !dataFim) {
            await customAlert("Por favor, selecione um período válido.");
            return;
        }
    
        if (!usuarioLogado || !usuarioLogado.id) {
            await customAlert("Usuário não autenticado.");
            return;
        }
    
        const urlParams = new URLSearchParams({
            id_usuario: usuarioLogado.id,
            data_inicio: dataInicio,
            data_fim: dataFim
        });
    
        window.location.href = `relatorio_gerado.html?${urlParams.toString()}`;
    }
    
    async function carregarMetas() {
        try {
            const resposta = await fetch('http://localhost:3000/metas', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
    
            if (!resposta.ok) {
                throw new Error("Erro ao carregar metas.");
            }
    
            const metas = await resposta.json();
            const corpoTabela = document.getElementById('corpo-metas');
            corpoTabela.innerHTML = "";
    
            if (metas.length === 0) {
                corpoTabela.innerHTML = "<tr><td colspan='5'>Nenhuma meta cadastrada.</td></tr>";
                return;
            }
    
            metas.forEach(meta => {
                let row = `<tr>
                    <td>${meta.titulo}</td>
                    <td>R$ ${meta.valor_meta.toLocaleString('pt-BR')}</td>
                    <td>R$ ${meta.valor_acumulado.toLocaleString('pt-BR')}</td>
                    <td>${new Date(meta.data_fim).toLocaleDateString('pt-BR')}</td>
                    <td><button class="editar-btn" onclick="editarMeta(${meta.id_meta})">Editar</button></td>
                </tr>`;
                corpoTabela.innerHTML += row;
            });
    
        } catch (error) {
            console.error("Erro ao carregar metas:", error);
        }
    }
      
    async function carregarMeta(id_meta) {
        try {
            const resposta = await fetch(`http://localhost:3000/metas/detalhes/${id_meta}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
    
            if (!resposta.ok) {
                const erroMsg = await resposta.json();
                throw new Error(erroMsg.message || "Erro desconhecido.");
            }
    
            const meta = await resposta.json();
    
            document.getElementById('id_meta').value = meta.id_meta;
            document.getElementById('titulo').textContent = meta.titulo;
            document.getElementById('data_inicio').textContent = new Date(meta.data_inicio).toLocaleDateString('pt-BR');
            document.getElementById('valor_meta').value = parseFloat(meta.valor_meta).toFixed(2);
            document.getElementById('valor_acumulado').value = parseFloat(meta.valor_acumulado).toFixed(2);
            document.getElementById('data_fim').value = meta.data_fim.split('T')[0];
    
        } catch (error) {
            console.error("Erro ao carregar meta:", error);
            await customAlert(`Erro ao carregar meta: ${error.message}`, "error");
            window.location.href = "gerenciar_metas.html";
        }
    }
    
    async function salvarEdicaoMeta() {
        const id_meta = document.getElementById('id_meta').value;
        const valor_meta = parseFloat(document.getElementById('valor_meta').value.trim());
        const valor_acumulado = parseFloat(document.getElementById('valor_acumulado').value.trim());
        const data_fim = document.getElementById('data_fim').value;
    
        if (isNaN(valor_meta) || isNaN(valor_acumulado) || !data_fim) {
            await customAlert("Preencha todos os campos obrigatórios.", "warning");
            return;
        }
    
        try {
            const resposta = await fetch(`http://localhost:3000/metas/atualizar/${id_meta}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ valor_meta, valor_acumulado, data_fim })
            });
    
            if (!resposta.ok) {
                const erroMsg = await resposta.json();
                throw new Error(erroMsg.message || "Erro ao salvar meta.");
            }
    
            if (valor_acumulado === valor_meta) {
                await customAlert("Parabéns! Você alcançou a sua meta financeira!", "success");
    
                await fetch(`http://localhost:3000/metas/excluir/${id_meta}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
    
            } else {
                await customAlert("Meta atualizada com sucesso!", "success");
            }
    
            window.location.href = "gerenciar_metas.html";
    
        } catch (error) {
            console.error("Erro ao atualizar meta:", error);
            await customAlert("Erro ao atualizar meta.", "error");
        }
    }    
    