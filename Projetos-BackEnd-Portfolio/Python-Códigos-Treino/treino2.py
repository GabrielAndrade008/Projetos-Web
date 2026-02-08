print("Sistema de segurança da Empresa Security JPRG")
print("===============================================")

cargos = {
    "cofundador": 35,
    "gerente": 12,
    "ads": 90,
    "segurança da informação": 700,
    "segurança": 1000,
    "faxineiro": 20,
    "estagiário": 10
}

cargo = input ("Informe seu cargo: ").strip().lower()
senha = int(input("Digite a senha conforme seu cargo: "))

if cargo in cargos and senha == cargos[cargo]:
    print(f"Seja bem-vindo(a) {cargo.capitalize()}!")
else:
    print("Acesso negado, tente novamente!")