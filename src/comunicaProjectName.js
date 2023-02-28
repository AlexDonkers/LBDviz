
import { QueryEngine } from '@comunica/query-sparql'

export async function queryComunicaProjectName() {
  const myEngine = new QueryEngine();
  const graphs = document.getElementById("GRAPH-input").value.split(',')
  const bindingsStream = await myEngine.queryBindings(`PREFIX bot: <https://w3id.org/bot#>
  SELECT ?s WHERE {
      ?s a bot:Building.
  } LIMIT 1`, {
    sources: graphs,
  });

  // Consume results as a stream (best performance)
  bindingsStream.on('data', (binding) => {
      const projectName = binding.get('s').value;;
      document.getElementById("project-name").innerHTML = projectName.split("#", 2)[1];

  });
  bindingsStream.on('end', () => {
      // The data-listener will not be called anymore once we get here.
  });
  bindingsStream.on('error', (error) => {
      console.error(error);
  });

}
window.queryComunicaProjectName = queryComunicaProjectName;
queryComunicaProjectName()