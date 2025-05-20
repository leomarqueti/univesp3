# Guia de Deploy no Render - Sorveteria Gelato

Este guia contém instruções passo a passo para implantar o sistema Sorveteria Gelato no Render, garantindo uma hospedagem gratuita e permanente.

## 1. Criar uma conta no Render

1. Acesse [render.com](https://render.com/)
2. Clique em "Sign Up" e crie uma conta (pode usar GitHub, GitLab ou e-mail)
3. Confirme seu e-mail se necessário

## 2. Fazer upload do projeto

1. Faça login no Render
2. No dashboard, clique em "New +" e selecione "Blueprint"
3. Conecte sua conta GitHub ou GitLab, ou use a opção "Upload" para enviar o arquivo ZIP diretamente
4. Se usar GitHub/GitLab, crie um novo repositório e faça upload dos arquivos do projeto
5. Se usar upload direto, selecione o arquivo ZIP do projeto

## 3. Configurar o Blueprint

1. Após o upload, o Render detectará automaticamente o arquivo `render.yaml`
2. Revise as configurações e clique em "Apply"
3. O Render criará automaticamente:
   - Um serviço web para a aplicação Django
   - Um banco de dados PostgreSQL

## 4. Aguardar a implantação

1. O Render iniciará o processo de build e deploy
2. Isso pode levar alguns minutos
3. Você pode acompanhar o progresso na interface do Render

## 5. Configurar o banco de dados

1. O banco de dados será criado automaticamente
2. As migrações serão executadas pelo script `build.sh`
3. Os dados iniciais serão carregados automaticamente

## 6. Acessar o site

1. Após a conclusão do deploy, o Render fornecerá um URL para seu site
2. O URL será algo como `https://sorveteria-gelato.onrender.com`
3. Clique no link para acessar seu site

## 7. Criar um usuário (se necessário)

1. Acesse a seção "Shell" do seu serviço web no Render
2. Execute o comando para criar um superusuário:
   ```
   python manage.py createsuperuser
   ```
3. Siga as instruções para criar um nome de usuário e senha

## Solução de problemas

Se encontrar algum problema durante o deploy:

1. Verifique os logs no Render (seção "Logs" do seu serviço)
2. Certifique-se de que todos os arquivos foram incluídos no upload
3. Verifique se o arquivo `render.yaml` está na raiz do projeto

## Manutenção

- Seu site permanecerá online permanentemente no plano gratuito do Render
- Para fazer alterações, você pode usar o GitHub/GitLab conectado ou fazer novo upload
- O Render implementará automaticamente as alterações quando detectadas

## Observações importantes

- O plano gratuito do Render pode ter limitações de recursos, mas é suficiente para projetos acadêmicos
- O site pode ficar um pouco lento após períodos de inatividade, mas não ficará offline como no ambiente temporário
- Recomendamos acessar o site regularmente para manter o desempenho ideal
