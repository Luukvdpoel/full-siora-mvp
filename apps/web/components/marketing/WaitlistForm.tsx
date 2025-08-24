'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import toast from 'react-hot-toast'

const schema = z.object({
  role: z.enum(['creator', 'brand']),
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  company: z.string().optional(),
  website: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  message: z.string().max(500).optional(),
  source: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, { message: 'Please accept to join the list' }),
})

type FormValues = z.infer<typeof schema>

const sources = [
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'friend', label: 'Friend/colleague' },
  { value: 'search', label: 'Search' },
  { value: 'other', label: 'Other' },
]

const WaitlistForm = () => {
  const [loading, setLoading] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'creator', name: '', email: '', company: '', website: '', message: '', source: '', consent: true },
  })
  const isBrand = form.watch('role') === 'brand'

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      try {
        const local = JSON.parse(localStorage.getItem('siora_waitlist') || '[]')
        local.push({ ...values, at: new Date().toISOString() })
        localStorage.setItem('siora_waitlist', JSON.stringify(local))
      } catch {}
      toast.success("You're on the list — we'll be in touch soon!", {
        duration: 4000,
      })
      form.reset({ role: values.role, consent: true })
    } catch (err) {
      console.error('Waitlist submission failed:', err)
      try {
        const local = JSON.parse(localStorage.getItem('siora_waitlist') || '[]')
        local.push({ ...values, at: new Date().toISOString() })
        localStorage.setItem('siora_waitlist', JSON.stringify(local))
      } catch {}
      toast("You're on the list!", {
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="waitlist" className="relative">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Join the early access waitlist</h2>
            <p className="mt-3 text-muted-foreground">
              Be first to try Siora. Whether you’re a creator or a brand, you’ll get updates and an invite when we open the doors.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>• Zero spam — just meaningful updates.</li>
              <li>• Priority invites for early sign-ups.</li>
              <li>• Help shape the roadmap.</li>
            </ul>
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-xl border border-[hsl(var(--brand)/0.2)] bg-card/60 p-6 shadow-sm backdrop-blur"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="role">I am a</Label>
                <div className="mt-2 inline-flex gap-2">
                  <Button type="button" variant={form.watch('role') === 'creator' ? 'brand' : 'outline'} onClick={() => form.setValue('role', 'creator')}>
                    Creator
                  </Button>
                  <Button type="button" variant={form.watch('role') === 'brand' ? 'brand' : 'outline'} onClick={() => form.setValue('role', 'brand')}>
                    Brand
                  </Button>
                </div>
              </div>
              <div className="col-span-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Alex Morgan" {...form.register('name')} />
                {form.formState.errors.name && (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@domain.com" {...form.register('email')} />
                {form.formState.errors.email && (
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              {isBrand && (
                <div className="col-span-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Brand or org" {...form.register('company')} />
                </div>
              )}
              <div className="col-span-2">
                <Label htmlFor="website">Website or profile</Label>
                <Input id="website" placeholder="https://..." {...form.register('website')} />
                {form.formState.errors.website && (
                  <p className="mt-1 text-xs text-destructive">Valid URL please</p>
                )}
              </div>
              <div className="col-span-2">
                <Label htmlFor="message">What would you use Siora for?</Label>
                <Textarea
                  id="message"
                  rows={3}
                  placeholder="Tell us a bit about your needs"
                  {...form.register('message')}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="source">How did you hear about us?</Label>
                <Select onValueChange={(v) => form.setValue('source', v)}>
                  <SelectTrigger id="source" className="w-full">
                    <SelectValue placeholder="Select a source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 mt-1 flex items-center gap-2">
                <input
                  id="consent"
                  type="checkbox"
                  className="size-4 accent-[hsl(var(--brand))]"
                  {...form.register('consent')}
                />
                <Label htmlFor="consent" className="text-sm text-muted-foreground">
                  I agree to receive early access updates
                </Label>
              </div>
              <div className="col-span-2 mt-2">
                <Button type="submit" variant="hero" size="xl" disabled={loading}>
                  {loading ? 'Joining...' : 'Join the waitlist'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default WaitlistForm
