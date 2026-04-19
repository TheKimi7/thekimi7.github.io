<script setup>
import { ref, reactive } from 'vue'

const WEB3FORMS_ACCESS_KEY = '4f1e5f67-3430-4453-b0cd-c34bf767b2a2'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  botcheck: '',
})

const status = ref('idle')
const errorMessage = ref('')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const submit = async () => {
  if (status.value === 'loading') return

  const name = form.name.trim()
  const email = form.email.trim()
  const subject = form.subject.trim()
  const message = form.message.trim()

  if (!name) {
    status.value = 'error'
    errorMessage.value = 'Please enter your name.'
    return
  }
  if (!EMAIL_REGEX.test(email)) {
    status.value = 'error'
    errorMessage.value = 'Please enter a valid email address.'
    return
  }
  if (!subject) {
    status.value = 'error'
    errorMessage.value = 'Please enter a subject.'
    return
  }
  if (message.length < 10) {
    status.value = 'error'
    errorMessage.value = 'Message should be at least 10 characters.'
    return
  }

  status.value = 'loading'
  errorMessage.value = ''

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        from_name: name,
        name,
        email,
        subject,
        message,
        botcheck: form.botcheck,
      }),
    })

    const data = await res.json()
    if (data.success) {
      status.value = 'success'
      form.name = ''
      form.email = ''
      form.subject = ''
      form.message = ''
    } else {
      status.value = 'error'
      errorMessage.value = data.message || 'Something went wrong. Please try again.'
    }
  } catch (err) {
    status.value = 'error'
    errorMessage.value = 'Network error. Please try again.'
  }
}
</script>

<template>
  <section id="contact-me" class="py-28 px-6">
    <div class="max-w-[1080px] mx-auto">
      <div class="flex items-center gap-4 mb-12">
        <span class="type-mono type-sm text-zinc-400 dark:text-text-tertiary">07</span>
        <h2 class="type-h2">Contact Me</h2>
        <div class="divider"></div>
      </div>

      <p class="type-body-lg text-zinc-600 dark:text-text-secondary mb-10 ">
        Have an interesting idea or just want to say hi? Drop me a message below! I typically respond within a couple of days.
        <br>Alternatively, feel free to reach out directly via
        <a href="mailto:inbox@pranavrajendran.com" class="text-zinc-500 dark:text-text-tertiary hover:text-zinc-900 dark:hover:text-text-primary transition-colors">inbox@pranavrajendran.com</a>.
      </p>

      <form
        @submit.prevent="submit"
        class="card p-6 sm:p-8 space-y-5"
      >
        <input
          v-model="form.botcheck"
          type="checkbox"
          name="botcheck"
          class="hidden"
          tabindex="-1"
          autocomplete="off"
        />

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label for="name" class="block type-mono type-xs uppercase tracking-widest text-zinc-400 dark:text-text-tertiary mb-2">
              Name*
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Your name"
              class="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-surface-0 border border-light-border dark:border-border type-sm text-inherit placeholder:text-zinc-400 dark:placeholder:text-text-tertiary focus:outline-none focus:border-zinc-500 dark:focus:border-text-tertiary transition-colors"
            />
          </div>
          <div>
            <label for="email" class="block type-mono type-xs uppercase tracking-widest text-zinc-400 dark:text-text-tertiary mb-2">
              Email*
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-surface-0 border border-light-border dark:border-border type-sm text-inherit placeholder:text-zinc-400 dark:placeholder:text-text-tertiary focus:outline-none focus:border-zinc-500 dark:focus:border-text-tertiary transition-colors"
            />
          </div>
        </div>

        <div>
          <label for="subject" class="block type-mono type-xs uppercase tracking-widest text-zinc-400 dark:text-text-tertiary mb-2">
            Subject*
          </label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            required
            placeholder="What's this about?"
            class="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-surface-0 border border-light-border dark:border-border type-sm text-inherit placeholder:text-zinc-400 dark:placeholder:text-text-tertiary focus:outline-none focus:border-zinc-500 dark:focus:border-text-tertiary transition-colors"
          />
        </div>

        <div>
          <label for="message" class="block type-mono type-xs uppercase tracking-widest text-zinc-400 dark:text-text-tertiary mb-2">
            Message*
          </label>
          <textarea
            id="message"
            v-model="form.message"
            required
            rows="6"
            placeholder="Your message..."
            class="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-surface-0 border border-light-border dark:border-border type-sm text-inherit placeholder:text-zinc-400 dark:placeholder:text-text-tertiary focus:outline-none focus:border-zinc-500 dark:focus:border-text-tertiary transition-colors resize-y"
          ></textarea>
        </div>

        <div class="flex items-center justify-between gap-4 flex-wrap pt-2">
          <button
            type="submit"
            :disabled="status === 'loading'"
            class="type-sm px-5 py-2.5 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            <span v-if="status === 'loading'">Sending...</span>
            <span v-else>Send Message</span>
          </button>

          <p v-if="status === 'success'" class="type-sm text-emerald-500">
            Message sent. Talk soon!
          </p>
          <p v-else-if="status === 'error'" class="type-sm text-red-500">
            {{ errorMessage }}
          </p>
        </div>
      </form>
    </div>
  </section>
</template>
