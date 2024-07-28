
export default function ActionItemDetailPage({ params }: { params: { id: string } }) {
    return (
        <main>
            This is a single action item: {params.id}

        </main>
    );
}
