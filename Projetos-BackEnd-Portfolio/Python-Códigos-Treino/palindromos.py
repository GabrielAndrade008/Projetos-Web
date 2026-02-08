def eh_palindromo(texto):
    texto = texto.lower().replace(" ", "")
    return texto == texto[::-1]

print(eh_palindromo("Ame a ema"))
