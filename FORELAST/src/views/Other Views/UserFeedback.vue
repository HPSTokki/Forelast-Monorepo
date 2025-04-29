<template>
    <section class="feedback-page">
        <div class="header">
            <h2>User Feedback</h2>
        </div>
        <h3>{{ questionSections[currentPage].title }}</h3>
        <div v-if="questionSections[currentPage]" class="body">
            <div class="question" v-for="question in questionSections[currentPage].questions" :key="question.id">
                <p>{{ question.text }}</p>
                <label v-for="option in question.options" :key="option.id">
                    <input required
                        type="radio"
                        :value="option.id"
                        :name="'question' + question.id"
                        v-model="question.selected" />
                    {{ option.label }}
                </label>
            </div>
        </div>

        <div class="footer">
            <div v-if="currentPage === questionSections.length - 1">
                <input
                    type="text"
                    placeholder="Report a bug (optional)"
                    class="bug-report" />
            </div>
            <div class="navigation-buttons">
                <button @click="currentPage--" :disabled="currentPage === 0">Previous</button>
                <button v-if="currentPage < questionSections.length - 1" @click="currentPage++">Next</button>
                <button v-else @click="submitFeedback">Submit Feedback</button>
            </div>
        </div>
        <Modal :isOpen="modalSuccess" @close="modalSuccess = false">
            <template #header>
                <h2>Sent Successfully</h2>
            </template>
            <template #image>
                <img src="@/assets/Home/footer/sent-icon.svg">
            </template>
            <template #body>
                <p>Your feedback has been successfully sent.</p>
            </template>
        </Modal>
        <Modal :isOpen="modalIncomplete" @close="modalIncomplete = false">
            <template #header>
                <h2>Heads up!</h2>
            </template>
            <template #image>
                <img src="@/assets/Home/quick forecast section/alert.svg">
            </template>
            <template #body>
                <p>Please answer all the questions before submitting.</p>
            </template>
        </Modal>
        <Modal :isOpen="limitModal" @close="limitModal = false">
            <template #header>
                <h2>Heads up!</h2>
            </template>
            <template #image>
                <img src="@/assets/Home/quick forecast section/alert.svg">
            </template>
            <template #body>
                <p>You can only answer this form once a week.</p>
            </template>
        </Modal>
    </section>
</template>

<script setup>
import Modal from '@/components/Modal.vue';
import { ref } from 'vue';

const modalSuccess = ref(false);
const modalIncomplete = ref(false);
const limitModal = ref(false);


const currentPage = ref(0);

const questionSections = ref([
    {
        title: 'I. Accessibility',
        questions: [
            {
                id: 1,
                text: 'The website application predicts the weather forecast accurately.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 2,
                text: 'I find it easy to navigate the website.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 3,
                text: 'The website’s load time is fast.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 4,
                text: 'I can easily find important information on the website.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 5,
                text: 'The website is mobile-friendly.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 6,
                text: 'I am able to access the website content without issues.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            }
        ]
    },
    {
        title: 'II. Visual Comfort',
        questions: [
            {
                id: 7,
                text: 'The color scheme used does not hurt my eyes.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 8,
                text: 'The text on the website is easy to read.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 9,
                text: 'The background contrast is appropriate.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 10,
                text: 'The website’s font size is suitable for easy reading.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 11,
                text: 'There is enough spacing between elements on the page.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 12,
                text: 'The website is visually appealing overall.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            }
        ]
    },
    {
        title: 'III. User Experience',
        questions: [
            {
                id: 13,
                text: 'The website provides a seamless experience when switching between pages.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 14,
                text: 'The search functionality on the website is effective.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 15,
                text: 'I feel comfortable using the website for extended periods of time.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            },
            {
                id: 16,
                text: 'I have no trouble interacting with the website’s forms and inputs.',
                options: [
                    { id: 'sagree', label: 'Strongly Agree' },
                    { id: 'agree', label: 'Agree' },
                    { id: 'disagree', label: 'Disagree' },
                    { id: 'sdisagree', label: 'Strongly Disagree' }
                ],
                selected: null,
            }
        ]
    }
]);

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const hasSubmittedThisWeek = () => {
    const lastSubmitted = localStorage.getItem('lastFeedbackSubmitted');
    if (!lastSubmitted) return false;

    const now = new Date().getTime();
    const lastTime = parseInt(lastSubmitted, 10);
    return (now - lastTime) < ONE_WEEK_MS;
};

// Handle form submission
const submitFeedback = async () => {
    if (hasSubmittedThisWeek()) {
        limitModal.value = true;
        return;
    }

    const incomplete = questionSections.value.some(section =>
        section.questions.some(q => q.selected === null)
    );
    if (incomplete) {
        modalIncomplete.value = true;
        return;
    }

    const formData = new FormData();

    questionSections.value.forEach((section, sectionIndex) => {
        section.questions.forEach((question, questionIndex) => {
            formData.append(`question${sectionIndex + 1}_${questionIndex + 1}`, question.text);

            const selectedOption = question.options.find(opt => opt.id === question.selected);
            const selectedLabel = selectedOption ? selectedOption.label : 'No answer';
            formData.append(`answer${sectionIndex + 1}_${questionIndex + 1}`, selectedLabel);
        });
    });

    const bugReport = document.querySelector('.bug-report').value;
    if (bugReport) {
        formData.append('bugReport', bugReport);
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submit-feedback/`, {
            method: 'POST', body: formData });
            if (!response.ok) {
        throw new Error('Failed to submit feedback.');
    }
    localStorage.setItem('lastFeedbackSubmitted', new Date().getTime().toString());
    modalSuccess.value = true;
    
    } catch (error) {
        console.error('Error submitting feedback:', error);
    }
}; 
</script>



<style scoped lang = "scss">
@use '@/styles/_userfeedback.scss';
</style>
