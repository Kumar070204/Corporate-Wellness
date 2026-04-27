# DataSprint_SJRK_64

# 🏝️ Corporate Wellness Gamified Survival Adventure

## 📌 Project Overview
Gamifies corporate wellness by turning employee health, nutrition, and activity into a survival adventure. Teams collect resources (firewood, food, water, shelter) by achieving real-world wellness goals. Failures such as absenteeism, stress, or poor nutrition trigger in-game disasters.

## 🎯 Features
- **Core Survival Resources** – Maps real-world wellness data (steps, sleep, nutrition, stress) to in-game survival elements.  
- **Personalized Goals** – BMI and calorie-based goals adjust daily steps and food intake for weight gain, loss, or maintenance.  
- **Food Court Integration** – Employees select meals; system analyzes nutrition and suggests balanced combinations.  
- **Gamification & Rewards** – Daily missions, weekly survival episodes, badges, and leaderboards keep employees engaged.  
- **AI Therapy Chatbot** – Provides mental wellbeing support and translates stress-relief actions into in-game benefits.  

## 📂 Datasets
### 1️⃣ employee_wellness_with_clerks_supervision.csv
Employee health, wellness, and activity metrics used to map real-world behavior to survival game resources.  

**Columns:** Employee_ID, Name, Age, Gender, Height_cm, Weight_kg, BMI, Dietary_Preference, Allergies, Health_Goals, Medical_Condition, Daily_Calories_Required, Heart_Rate_bpm, Step_Count, Calories_Burned, SpO2, Respiratory_Rate, HRV, Team_Name, Role.  

### 2️⃣ Indian_Food_Nutrition_Categorized_Board.csv
Nutritional information for Indian foods, used to calculate energy, macros, and survival buffs/penalties.  

**Columns:** Dish Name, Calories, Carbohydrates, Protein, Fats, Free Sugar, Fibre, Sodium, Calcium, Iron, Vitamin C, Folate, Detailed_Category, Broad_Category.  

## 🖥 Code
**Team_SJRK_MLCODE.py**  
- Implements Random Forest Regressor for predicting personalized wellness and nutrition outcomes.  
- Integrates both datasets to calculate step goals, calorie needs, and survival scores.  
- Maps real-world data to gamified in-game resources.  
- Generates dashboards for individual and team performance.  

## 🎨 Front_End
The **Front_End** folder contains all the JavaScript code for our prototype’s user interface.  
- Implements interactive dashboards, leaderboards, and survival game visuals.  
- Provides seamless navigation between wellness tracking, food logging, and gamified missions.  
- Built with a focus on usability and engagement to make the survival adventure immersive.  

## 📊 Presentation
**SJRK-DATASPRINT.pptx**  
- Explains all features, datasets, integration, niche scenarios, AI therapy chatbot, dashboards, and gamification.  
- Story-driven visuals illustrate survival island, team progress, and wellness outcomes.  

## ⚡ How It Works
1. Employees sync wearable and HR data.  
2. AI calculates personalized wellness and nutrition goals.  
3. Gamified system translates goals into survival resources.  
4. Teams collaborate to stay alive, win rewards, and boost real-world wellness.  

