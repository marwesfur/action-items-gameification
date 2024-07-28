import './flash.component.css';

// todo: can we make it work with arbitrary content/children?
export default function Flash({ content, flash }: { content: string, flash: boolean }) {
    return (
        <>
            { content }
            <span className={'flash-text' + (flash ? ' animate' : '')}>{ content }</span>
        </>
    );
}