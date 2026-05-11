import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode;
    wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { className = '', wrapperClassName = '', icon, ...props },
    ref,
) {
    return (
        <div className={`relative w-full ${wrapperClassName}`.trim()}>
            {icon ? (
                <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
                    {icon}
                </span>
            ) : null}
            <input
                ref={ref}
                className={[
                    'app-input w-full rounded-xl border border-border/50 bg-secondary/60 text-foreground',
                    'h-12 px-4 placeholder:text-muted-foreground',
                    'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30',
                    icon ? 'pl-11' : '',
                    className,
                ].join(' ').trim()}
                {...props}
            />
        </div>
    );
});

export default Input;
