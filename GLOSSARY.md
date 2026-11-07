# Documentos brasileiros

Validação e formatação dos identificadores fiscais brasileiros de pessoa física (CPF) e jurídica (CNPJ).

## Language

**Documento**:
Um CPF ou um CNPJ, tratado como texto.
_Avoid_: ID, número, registro

**CPF**:
Identificador de pessoa física: 11 dígitos, dos quais os 2 últimos são dígitos verificadores.
_Avoid_: CIC

**CNPJ**:
Identificador de pessoa jurídica: 14 caracteres, dos quais os 2 últimos são dígitos verificadores. Pode ser numérico ou alfanumérico.

**CNPJ alfanumérico**:
CNPJ em que as 12 primeiras posições podem ter letras A–Z além de dígitos (vigente desde jul/2026). Os 2 dígitos verificadores continuam numéricos.
_Avoid_: novo CNPJ, CNPJ com letras

**Dígito verificador (DV)**:
Cada um dos 2 caracteres finais de um Documento, calculados por módulo 11 a partir das posições anteriores.
_Avoid_: check digit, dígito de controle

**Máscara**:
A pontuação padrão de um Documento: `000.000.000-00` para CPF e `00.000.000/0000-00` para CNPJ.
_Avoid_: formato, pontuação

**Forma normalizada**:
O Documento sem Máscara, sem espaços nas pontas e com letras em maiúsculas.
_Avoid_: forma limpa, raw

**Sequência repetida**:
Documento cujos caracteres são todos iguais (ex.: `111.111.111-11`). Sempre inválido, mesmo quando o DV confere.
