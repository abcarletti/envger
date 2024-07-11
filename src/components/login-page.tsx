import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/auth"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

export function LoginPage() {
    return (
        <section className="flex items-center">
            <Card className="mx-auto max-w-sm h-fit">
                <CardHeader>
                    <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
                    <CardDescription>
                    Ingrese su nombre de usuario a continuación para iniciar sesión en su cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Usuario</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Contraseña</Label>
                                <Link href="#" className="ml-auto inline-block text-sm underline">
                                    ¿Has olvidado tu contraseña?
                                </Link>
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Iniciar sesión
                        </Button>
                        <form
                            action={async () => {
                                "use server"
                                await signIn('github')
                            }}
                        >
                            <Button type="submit" variant="outline" className="w-full gap-2">
                                <GitHubLogoIcon/> Iniciar sesión con GitHub
                            </Button>
                        </form>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        ¿Todavía no tienes una cuenta?{" "}
                        <Link href="#" className="underline">
                            Registrarme
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </section >
    )
}
