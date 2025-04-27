import Editor from "./components/Editor";
import { EditorProvider } from "./context/EditorContext";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">ScribeFlow</h1>
          {/* <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
              Share
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Save
            </button>
          </div> */}
        </div>
      </header>

      <main className="flex-1 overflow-auto py-8">
        <div className="max-w-3xl mx-auto px-4">
          <EditorProvider>
            <Editor />
          </EditorProvider>
        </div>
      </main>
    </div>
  );
}

export default App;
