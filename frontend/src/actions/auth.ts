"use server"//Arquivo para ser executado no servidor nao do lado cliente

export async function registerAction(
    previState:{sucess: boolean; error: string } | null,
    formData: FormData
){
    console.log("clicou em cadastrar")
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log(name)
    console.log(email)
    console.log(password)

    return{success: true, error: "Erro ao cadastrar"}
}