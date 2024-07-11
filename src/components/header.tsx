import AvatarStatus from "./avatar-status";
import { ModeToggle } from "./theme-switch";

export function Header() {
    return (
        <header className="flex justify-between items-center p-4 bg-secondary/90 fixed w-full h-16">
            <h1 className="px-2 text-secondary-foreground text-2xl font-bold">
                <span className="text-primary"> {'<'} </span>
                GuardNotes
                <span className="text-primary"> {'/>'} </span>
            </h1>
            {/* <ModeToggle /> */}
            <AvatarStatus />
        </header>
    )
}