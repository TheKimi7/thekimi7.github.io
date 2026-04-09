<script setup>
const publications = [
  {
    title: 'V-SHIELD: Vulnerability and Security Hazard Investigation for Logic Locking with Constant Propagation Attack Deployment (in Peer Review)',
    venue: 'MysoreCon 2024 @ VVIET Mysore',
    type: 'IEEE',
    date: 'Sept 2024',
    authors: 'R Pranav, B Kavinandhan, M J Vinu Prasanth, N Mohankumar',
    description: 'Generated artificial datasets using DCGAN to augment limited agricultural data. Evaluated CNN models including InceptionV3, VGG16, ResNet50, and MobileNetV2. Achieved 99% accuracy with MobileNetV2, demonstrating the effectiveness of synthetic data augmentation',
    link: '',
    status: 'in-progress',
  },
  {
    title: 'A Hybrid Approach for Cotton Leaf Disease Detection using DCGAN and Diverse CNN Models',
    venue: 'ICITIIT 2024 @ IIIT Kottayam',
    type: 'IEEE',
    date: 'July 2024',
    authors: 'R Pranav, B Kavinandhan, M Ganesan',
    description: 'Generated artificial datasets using DCGAN to augment limited agricultural data. Evaluated CNN models including InceptionV3, VGG16, ResNet50, and MobileNetV2. Achieved 99% accuracy with MobileNetV2, demonstrating the effectiveness of synthetic data augmentation',
    link: 'https://doi.org/10.1109/ICITIIT61487.2024.10580758',
  },
  {
    title: 'PRECISE HEART: Heart Disease Prediction using Machine Learning ',
    venue: 'IJARCCE',
    type: 'SCI',
    date: 'May 2024',
    authors: 'R Pranav, B Kavinandhan, M J Vinu Prasanth, N Mohankumar',
    description: 'Implemented ML models including SVM, Naive Bayes, Decision Trees, and KNN for heart disease prediction. Developed performance evaluation using ROC curves and classification metrics. Achieved high diagnostic accuracy using KNN, supporting improved early detection and management. ',
    // link: 'https://doi.org/10.17148/IJARCCE.2024.134183',
    link: 'https://www.researchgate.net/publication/380365442_PRECISE_HEART_HEART_DISEASE_PREDICTION_USING_MACHINE_LEARNING'
  },
]
</script>

<template>
  <section id="publications" class="py-28 px-6">
    <div class="max-w-[1080px] mx-auto">
      <div class="flex items-center gap-4 mb-12">
        <span class="type-mono type-sm text-zinc-400 dark:text-text-tertiary">06</span>
        <h2 class="type-h2">Publications</h2>
        <div class="divider"></div>
      </div>
<div class="space-y-4">
  <component
    :is="pub.status === 'in-progress' ? 'div' : 'a'"
    v-for="pub in publications"
    :key="pub.title"
    v-bind="pub.status !== 'in-progress' ? { href: pub.link, target: '_blank', rel: 'noopener noreferrer' } : {}"
    class="group card p-6 block"
  >
    <div class="flex items-center gap-3 mb-3">
      <span class="tag">{{ pub.type }}</span>
      <span class="type-mono type-xs text-zinc-400 dark:text-text-tertiary">{{ pub.date }}</span>
      <span
        v-if="pub.status === 'in-progress'"
        class="type-mono type-xs px-2 py-0.5 rounded-full border border-zinc-500 text-zinc-400"
      >
        in peer review
      </span>
    </div>

    <h3 class="type-h3 mb-2 group-hover:text-zinc-600 dark:group-hover:text-white transition-colors duration-150">
      {{ pub.title }}
    </h3>

    <p class="type-sm text-zinc-500 dark:text-text-secondary mb-1">{{ pub.venue }}</p>
    <p class="type-mono type-xs text-zinc-400 dark:text-text-tertiary mb-3">{{ pub.authors }}</p>
    <p class="type-sm text-zinc-500 dark:text-text-tertiary">{{ pub.description }}</p>
  </component>
</div>
    </div>
  </section>
</template>
