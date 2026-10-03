# Preto Show — Site Oficial

Site estático (HTML + CSS + JS puro) para o cantor e produtor angolano **Preto Show**.

## Conceito visual
- **Regra 60/30/10:** 60% preto (`#0B0908`), 30% vermelho (`#D62631`), 10% ouro (`#FFC21A`) — as cores da bandeira de Angola e das capas *Coringa* / *Dança Assim*.
- **Padrão afro geométrico** (zigzags, círculos, triângulos, losangos) inspirado no banner do artista; preenche o título "PRETO" e anima-se no hero em canvas, reagindo ao rato.
- **150 BPM:** o site "bate" ao ritmo do hit *150 Bpm* — logo, equalizador, anéis e números pulsam a 400 ms. Pode ser desligado no botão do menu.

## Secções (estrutura inspirada em theweeknd.com)
Hero com último lançamento → Música (discografia filtrável + leitor Spotify embutido) → Vídeos → Tour (próximas datas + arquivo) → Loja (merch "em breve" com pré-registo) → Sobre → Newsletter.

## Editar conteúdo
Todos os dados estão no topo de `main.js`: `RELEASES`, `VIDEOS`, `SHOWS`, `PRODUCTS`.
- Newsletter: definir `NEWSLETTER_ENDPOINT` (Formspree, Mailchimp, etc.). Sem endpoint o formulário só valida e mostra a confirmação.
- Vídeos: actualmente ligam a pesquisas no YouTube; substituir por links dos vídeos oficiais.
- Redes sociais (Instagram/TikTok/YouTube oficiais) a acrescentar no rodapé.

## Deploy
Render → *Static Site* (ver `render.yaml`). Publish directory: `.` — sem build.

## Local
```bash
python3 -m http.server 8080
```
