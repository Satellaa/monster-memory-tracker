'use client'

import { useState, useRef, useCallback, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuestionMarkCircledIcon, DownloadIcon } from "@radix-ui/react-icons"
import ReactMarkdown from 'react-markdown'
import html2canvas from 'html2canvas'
import data from '../../results/cases.json'

const STATUS_COLORS = {
  Remembered: 'text-blue-600',
  Forgotten: 'text-red-600',
  'Refer to ruling': 'text-orange-400'
} as const

type MemoryStatus = keyof typeof STATUS_COLORS

interface Source {
  text: string
  url: string
}

interface FAQ {
  question: string
  answer: string
  sources: Source[]
}

interface MonsterMemoryCase {
  id: number
  info: string
  temporaryBanished: MemoryStatus
  flipFaceDown: MemoryStatus
  temporaryBanishedFAQs: FAQ[]
  flipFaceDownFAQs: FAQ[]
}

interface MonsterMemoryCategory {
  name: string
  items: MonsterMemoryCase[]
}

const getMonsterMemory = (): MonsterMemoryCategory[] => data as MonsterMemoryCategory[]

// Memoized Components
const StatusDisplay = memo(({ status }: { status: MemoryStatus }) => (
  <span className={`font-medium ${STATUS_COLORS[status]}`}>
    {status}
  </span>
))

StatusDisplay.displayName = 'StatusDisplay'

const Source = memo(({ source, index }: { source: Source; index: number }) => (
  <li key={index}>
    <a 
      href={source.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-blue-600 hover:underline"
    >
      {source.text}
    </a>
  </li>
))

Source.displayName = 'Source'

const FAQItem = memo(({ faq, index }: { faq: FAQ; index: number }) => (
  <div key={index} className="space-y-2">
    <div>
      <h5 className="font-medium">Q:</h5>
      <ReactMarkdown>{faq.question}</ReactMarkdown>
    </div>
    <div>
      <h5 className="font-medium">A:</h5>
      <ReactMarkdown>{faq.answer}</ReactMarkdown>
    </div>
    <div>
      <h5 className="font-medium">Sources:</h5>
      <ul className="list-disc pl-5">
        {faq.sources.map((source, idx) => (
          <Source key={idx} source={source} index={idx} />
        ))}
      </ul>
    </div>
  </div>
))

FAQItem.displayName = 'FAQItem'

const FAQSection = memo(({ title, faqs }: { title: string; faqs: FAQ[] }) => (
  <div>
    <h4 className="font-medium text-lg mb-2">{title}:</h4>
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <FAQItem key={index} faq={faq} index={index} />
      ))}
    </div>
  </div>
))

FAQSection.displayName = 'FAQSection'

const FAQDialog = memo(({ 
  temporaryBanishedFAQs, 
  flipFaceDownFAQs 
}: { 
  temporaryBanishedFAQs: FAQ[]
  flipFaceDownFAQs: FAQ[] 
}) => {
  const hasFAQs = temporaryBanishedFAQs.length > 0 || flipFaceDownFAQs.length > 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 p-0 ${hasFAQs ? 'text-blue-600' : 'text-black'}`}
        >
          <QuestionMarkCircledIcon className="h-4 w-4" />
          <span className="sr-only">Open FAQ</span>
        </Button>
      </DialogTrigger>
      {hasFAQs && (
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>FAQ</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {temporaryBanishedFAQs.length > 0 && (
              <FAQSection title="Temporary Banished" faqs={temporaryBanishedFAQs} />
            )}
            {flipFaceDownFAQs.length > 0 && (
              <FAQSection title="Flip Face-Down" faqs={flipFaceDownFAQs} />
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
})

FAQDialog.displayName = 'FAQDialog'

const TableRow = memo(({ item }: { item: MonsterMemoryCase }) => (
  <tr className="border-b">
    <td className="p-4">{item.info}</td>
    <td className="p-4 border-l">
      <StatusDisplay status={item.temporaryBanished} />
    </td>
    <td className="p-4 border-l">
      <StatusDisplay status={item.flipFaceDown} />
    </td>
    <td className="p-4 border-l">
      <FAQDialog 
        temporaryBanishedFAQs={item.temporaryBanishedFAQs} 
        flipFaceDownFAQs={item.flipFaceDownFAQs} 
      />
    </td>
  </tr>
))

TableRow.displayName = 'TableRow'

export function MonsterMemoryTableComponent() {
  const monsterMemoryCategories = getMonsterMemory()
  const [selectedCategory, setSelectedCategory] = useState(monsterMemoryCategories[0].name)
  const componentRef = useRef<HTMLDivElement>(null)
  
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value)
  }, [])

  const saveAsImage = useCallback(async () => {
    if (!componentRef.current) return

    try {
      const canvas = await html2canvas(componentRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      })
      
      const image = canvas.toDataURL("image/png")
      const link = document.createElement('a')
      link.href = image
      link.download = 'monster-memory-table.png'
      link.click()
    } catch (error) {
      console.error("Error saving image:", error)
    }
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div ref={componentRef}>
        <CardHeader className="flex flex-col items-center justify-between">
          <CardTitle className="text-xl font-bold text-center uppercase">
            Information that monster(s) remembers or forgets after being temporary banished or flipped face-down
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            The information on this page is sourced from the OCG. Some or all of it may not apply to the TCG.
          </p>
          <Button onClick={saveAsImage} variant="outline" size="icon">
            <DownloadIcon className="h-4 w-4" />
            <span className="sr-only">Save as image</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={handleCategoryChange} defaultValue={selectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {monsterMemoryCategories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Tabs value={selectedCategory}>
            {monsterMemoryCategories.map((category) => (
              <TabsContent key={category.name} value={category.name}>
                <div className="border rounded-lg mt-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-4 text-left font-medium">Information on the card</th>
                        <th className="p-4 text-left font-medium border-l">Temporary Banished</th>
                        <th className="p-4 text-left font-medium border-l">Flipped Face-down</th>
                        <th className="p-4 text-left font-medium border-l">FAQ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item) => (
                        <TableRow key={item.id} item={item} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </div>
    </Card>
  )
}