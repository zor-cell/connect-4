function App() {
    const [runs, setRuns] = React.useState(100000);

    function onRunsChange(event) {
        setRuns(Number(event.target.value));
    }

    function handleSubmit(event) {
        document.getElementById("result").innerHTML = "Computing result...";
        
        //stop page from reloading after submit
        event.preventDefault();

        //wait for module to initialize,
        createModule().then(({Main}) => {
            //perform computation
            const main = new Main();
            let result = main.run();

            document.getElementById("result").innerHTML = result;
        });
    }

    return (
        <div>
            <h1>My Title</h1>
            <div>
                <form id="parameters" onSubmit={handleSubmit}>
                    <span>Runs</span>
                    <input type="number" value={runs} onChange={onRunsChange}></input>

                    <input type="submit" value="Run"></input>
                </form>
            </div>

            <h2>Result</h2>
            <h3 id="result">No Result</h3>
        </div>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);