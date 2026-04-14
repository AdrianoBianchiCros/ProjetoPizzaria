"use client"
import { useActionState } from 'react' 
import {Card,CardHeader,CardTitle,CardAction,CardContent,CardDescription,CardFooter} from '@/components/ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Link from 'next/link' 
import { registerAction } from '@/actions/auth'

export function RegisterForm(){

    const [state,formAction, isPending] = useActionState(registerAction, null)

    return(
       <Card className='bg-app-card border-app-border border w-full max-w-md mx-auto '>
        <CardHeader>
            <CardTitle className='text-white text-center text-3xl sm:text-4xl font-bold '>
                Cadastro de <span className='text-brand-primary'>usuarios!</span> </CardTitle>
        </CardHeader>
        <CardContent>
            <form className='space-y-4' action={formAction}>
                <div className='space-y-2'>
                    <Label className='text-white'>Nome</Label>
                    <Input 
                    type='text' 
                    id='name' 
                    name='name'
                    placeholder='Digite seu nome' 
                    required minLength={3} 
                    className='text-white bg-app-card border border-app-border ' 
                     />
                </div>
                <div className='space-y-2'>
                    <Label className='text-white'>E-mail</Label>
                    <Input 
                    type='text' 
                    id='email' 
                    name='email'
                    placeholder='Digite seu email' 
                    required
                    className='text-white bg-app-card border border-app-border ' 
                     />
                </div>
                 <div className='space-y-2'>
                    <Label htmlFor='password' className='text-white'>Senha</Label>
                    <Input 
                    type='password' 
                    id='password' 
                    name='password'
                    placeholder='Digite sua senha' 
                    required
                    className='text-white bg-app-card border border-app-border ' 
                     />
                </div>
            <Button type='submit' className='w-full bg-brand-primary text-white hover: bg-brand-primary'>
                {isPending ? "Criando conta..." : "Criar conta"}
            </Button>
            <p className='text-center text-gray-100'>
                Já é cadastrado ? <Link className='text-brand-primary' href="/login"> Faça o login</Link>
            </p>
            </form>
        </CardContent>

       </Card>
    )
}