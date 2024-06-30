document.addEventListener('DOMContentLoaded', (event) => {
    const dobInput = document.getElementById('dob');
    const ageInput = document.getElementById('age');

    dobInput.addEventListener('change', function() {
        const dob = new Date(this.value);
        const today = new Date();

         // Verifica se a data de nascimento é maior que a data atual
         if (dob > today) {
            alert('A data de nascimento não pode ser maior que a data atual.');
            this.value = ''; // Limpa o campo de data de nascimento
            ageInput.value = ''; // Limpa o campo de idade
            return;
        }
        
        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();

        // Ajusta a idade se o aniversário ainda não tiver sido alcançado neste ano
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        ageInput.value = age;
    });
});

let experiences = [];
let educations = [];

document.getElementById('addExperience').addEventListener('click', function() {
    const empresa = document.getElementById('empresa').value;
    const funcao = document.getElementById('funcao').value;
    const inicio = document.getElementById('inicio').value;
    const fim = document.getElementById('fim').value;
    const atualmente = document.getElementById('atualmente').checked;

    if (empresa && funcao && inicio && (fim || atualmente)) {
        experiences.push({ empresa, funcao, inicio, fim, atualmente });
        alert('Experiência adicionada!');
        // Limpa os campos após adicionar
        document.getElementById('empresa').value = '';
        document.getElementById('funcao').value = '';
        document.getElementById('inicio').value = '';
        document.getElementById('fim').value = '';
        document.getElementById('atualmente').checked = false;
    } else {
        alert('Preencha todos os campos.');
    }
});

document.getElementById('addEducation').addEventListener('click', function() {
    const instituicao = document.getElementById('instituicao').value;
    const curso = document.getElementById('curso').value;
    const inicio_curso = document.getElementById('inicio_curso').value;
    const fim_curso = document.getElementById('fim_curso').value;

    if (instituicao && curso && inicio_curso && fim_curso) {
        educations.push({ instituicao, curso, inicio_curso, fim_curso });
        alert('Formação adicionada!');
        // Limpa os campos após adicionar
        document.getElementById('instituicao').value = '';
        document.getElementById('curso').value = '';
        document.getElementById('inicio_curso').value = '';
        document.getElementById('fim_curso').value = '';
    } else {
        alert('Preencha todos os campos.');
    }
});

// Função para formatar as datas no padrão dia-mês-ano
function formatDate(date) {
    if (!date) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('pt-BR', options);
}

// Função para verificar a necessidade de nova página
function checkPageOverflow(doc, currentY, maxHeight = 280) {
    if (currentY > maxHeight) {
        doc.addPage();
        return 20; // Reset Y position for new page
    }
    return currentY;
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Dados pessoais
    const nome = document.getElementById('name').value;
    const dob = formatDate(document.getElementById('dob').value);
    const endereco = document.getElementById('adress').value;
    const contato = document.getElementById('contato').value;
    const idade = document.getElementById('age').value;  // Capturar a idade

    // Títulos
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text('Currículo', 105, 20, null, null, 'center');

    // Seção de Dados Pessoais
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text('Dados Pessoais', 10, 40);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome: ${nome}`, 10, 50);
    doc.text(`Data de Nascimento: ${dob}`, 10, 60);
    doc.text(`Idade: ${idade}`, 10, 70);  // Adicionar a idade
    doc.text(`Endereço: ${endereco}`, 10, 80);
    doc.text(`Contato: ${contato}`, 10, 90);

    // Seção de Experiências Profissionais
    let currentY = 110;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text('Experiência Profissional', 10, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    experiences.forEach((exp, index) => {
        doc.text(`Empresa: ${exp.empresa}`, 10, currentY);
        currentY += 10;
        doc.text(`Função: ${exp.funcao}`, 10, currentY);
        currentY += 10;
        doc.text(`Início: ${formatDate(exp.inicio)}`, 10, currentY);
        currentY += 10;
        if (exp.atualmente) {
            doc.text('Atualmente: Sim', 10, currentY);
        } else {
            doc.text(`Fim: ${formatDate(exp.fim)}`, 10, currentY);
        }
        currentY += 20;  // Espaço entre experiências
        currentY = checkPageOverflow(doc, currentY);
    });

    // Seção de Formação Acadêmica
    currentY += 10;
    currentY = checkPageOverflow(doc, currentY);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text('Formação Acadêmica', 10, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    educations.forEach((edu, index) => {
        doc.text(`Instituição: ${edu.instituicao}`, 10, currentY);
        currentY += 10;
        doc.text(`Curso: ${edu.curso}`, 10, currentY);
        currentY += 10;
        doc.text(`Início: ${formatDate(edu.inicio_curso)}`, 10, currentY);
        currentY += 10;
        doc.text(`Fim: ${formatDate(edu.fim_curso)}`, 10, currentY);
        currentY += 20;  // Espaço entre formações
        currentY = checkPageOverflow(doc, currentY);
    });

    // Baixar o PDF
    doc.save('curriculo.pdf');
}


