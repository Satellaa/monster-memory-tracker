import { MonsterMemoryTableComponent } from '@/components/monster-memory-table'

export default function Home() {
  return (
	  <div className="flex flex-col items-center justify-center min-h-screen">
	    <MonsterMemoryTableComponent />
	    <a
	      href="https://github.com/satellaa/monster-memory-cases"
	      target="_blank"
	      rel="noopener noreferrer"
	      className="text-sm text-blue-600 hover:underline"
	    >
	      Contribute information to the project
	    </a>
	  </div>
  );
}