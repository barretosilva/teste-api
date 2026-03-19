API de Gerenciamento de Pedidos

O objetivo central foi construir uma API RESTful para o gerenciamento de pedidos (CRUD completo), implementar camada de Data Mapping para tratar e transformar o payload recebido antes de persisti-lo no banco de dados.

Para facilitar fiz o deploy da aplicação e disponibilizei a documentação interativa.

[CLIQUE AQUI PARA TESTAR A API (SWAGGER) EM PRODUÇÃO](https://api-jitterbit-andre.onrender.com/)

O Desafio da Transformação de Dados (Mapping)

O ponto alto desse teste foi lidar com a inconsistência proposital dos dados de entrada. A API precisava ser resiliente o suficiente para receber chaves com espaços "valor Total" e erros de digitação "quantidadeltem" com 'L' minúsculo em vez de 'I' maiúsculo e normalizar isso para o padrão do banco.

Como o dado chega (Payload):

{
  "numeroPedido": "v10089015vdb-01",
  "valor Total": 10000,
  "data Criacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [{ "idItem": "2434", "quantidadeltem": 1, "valorltem": 1000 }]
}


Como a API processa e salva (MongoDB):

{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [{ "productId": 2434, "quantity": 1, "price": 1000 }]
}


A lógica de transformação foi isolada no Controller para garantir que o Model receba apenas dados limpos e tipados corretamente.

Arquitetura e Decisões Técnicas

Fugi do padrão de colocar tudo num index.js gigante. Estruturei o projeto baseando-me em MVC (Model-View-Controller) para garantir escalabilidade:

/models: Definição do Schema rígido usando Mongoose. Escolhi o MongoDB por lidar nativamente de forma excelente com documentos JSON aninhados (como o array de itens do pedido).

/controllers: Estão aqui as regras de negócio, o data mapping e os blocos try/catch para tratamento amigável de erros (retornando status HTTP corretos como 400, 404 e 500).

/routes: Separação das rotas da aplicação.

Nuvem: Banco hospedado no MongoDB Atlas e API servida no Render.

Endpoints da API

Toda a documentação pode ser testada ativamente acessando a rota /api-docs gerada pelo Swagger.

Método
Rota
Descrição
POST

/order

Recebe o payload bruto, transforma e cria um novo pedido.

GET

/order/list

Retorna uma lista com todos os pedidos salvos no banco.

GET

/order/{orderId}

Busca e retorna um pedido específico através do seu ID gerado.

PUT

/order/{orderId}

Atualiza os dados de um pedido existente.

DELETE

/order/{orderId}

Remove um pedido da base de dados.

Como rodar o projeto local

Se preferir testar o código localmente

Clone este repositório:

git clone [https://github.com/barretosilva/jitterbit-teste-api.git](https://github.com/barretosilva/jitterbit-teste-api.git)
cd jitterbit-teste-api

Instale as dependências:

npm install

Configure as Variáveis de Ambiente:
Crie um arquivo .env na raiz do projeto e adicione a sua string de conexão do MongoDB:

PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<senha>@seu-cluster.mongodb.net/jitterbit_orders


Rode a aplicação:

# Para ambiente de desenvolvimento (com auto-reload)
npm run dev

# Ou para produção
npm start


Acesse no navegador:
Abra http://localhost:3000 (ser redirecionad automaticamente para o Swagger).

Feito por André Silva ☕
[Conecte-se comigo no LinkedIn](https://www.linkedin.com/in/barretosilva/)
