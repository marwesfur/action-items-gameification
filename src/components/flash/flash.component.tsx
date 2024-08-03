import './flash.component.css';

// todo: can we make it work with arbitrary content/children?
export default function Flash({ content, flash, flashClassName }: { content: string, flash: boolean, flashClassName?: string }) {
    const fullClassName = `flash-text ${flash ? ' animate' : ''} ${flashClassName ?? ''}`;

    return (
        <>
            { content }
            <span className={fullClassName}>{ content }</span>
        </>
    );
}