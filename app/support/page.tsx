export default function ForumPage() {
    return (
        <>
            <div className="min-h-screen bg-white flex flex-col">
                <main className="flex-grow container mx-auto p-6 overflow-y-auto">
                    <h1 className="text-4xl font-bold mb-8 text-primary">Fórum da Comunidade</h1>

                    {/* Formulário para novo tópico */}
                    <div className="bg-muted p-6 rounded-2xl shadow-md mb-12 border">
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">Criar novo tópico</h2>
                        <form className="space-y-4">
                            <input
                                type="text"
                                placeholder="Título do tópico"
                                className="w-full p-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <textarea
                                placeholder="Escreva sua mensagem..."
                                className="w-full p-3 border rounded-lg bg-background text-foreground h-28 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
                            >
                                Publicar
                            </button>
                        </form>
                    </div>

                    {/* Lista de tópicos */}
                    <div className="space-y-4">
                        {[
                            {
                                title: 'Como integrar o ChatGPT com React?',
                                author: 'usuário123',
                                time: '2 dias atrás',
                            },
                            {
                                title: 'Problemas com Docker e Vite',
                                author: 'devfrontend',
                                time: '5 dias atrás',
                            },
                        ].map((topic, index) => (
                            <div
                                key={index}
                                className="p-5 rounded-xl border bg-background hover:bg-muted cursor-pointer transition shadow-sm"
                            >
                                <h3 className="text-xl font-semibold text-foreground">{topic.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Postado por <span className="font-medium">{topic.author}</span> · {topic.time}
                                </p>
                            </div>
                        ))}
                    </div>
                </main>

            </div></>
    );
}
