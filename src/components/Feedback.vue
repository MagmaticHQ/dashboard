<template>
  <div class="feedback">
    <a
      href="https://kw70urepif3.typeform.com/to/D2EYOufq"
      target="_blank"
    >
      Send feedback
    </a>
  </div>
</template>

<style scoped>
.feedback {
  position: fixed;
  z-index: 1;
  right: 32px;
  bottom: 16px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
  background: var(--background-secondary);
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .feedback {
    display: none;
  }
}
</style>
