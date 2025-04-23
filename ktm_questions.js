// File: ktm_questions.js

export const questionBank = {
    "Physics": [
       [
    { 
        id: "KP001", 
        questionText: "Planet A has mass 'x' and planet B has mass 10kg. If the mass of planet A is doubled and the mass of planet B is tripled, what will be the ratio of the initial Gravitational Force to the final Gravitational Force between them (assuming distance remains constant)?", 
        options: [
            { id: "a", text: "1:6" }, 
            { id: "b", text: "6:1" }, 
            { id: "c", text: "1:5" }, 
            { id: "d", text: "5:1" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP002", 
        questionText: "If a particle starts from rest and undergoes uniform acceleration of 5 m/s², how long does it take to reach a speed of 25 m/s?", 
        options: [
            { id: "a", text: "2 s" }, 
            { id: "b", text: "5 s" }, 
            { id: "c", text: "10 s" }, 
            { id: "d", text: "125 s" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP003", 
        questionText: "A wooden block floats on water with 60% of its volume submerged. What is the density of the block? (Density of water = 1000 kg/m³)", 
        options: [
            { id: "a", text: "600 kg/m³" }, 
            { id: "b", text: "400 kg/m³" }, 
            { id: "c", text: "1000 kg/m³" }, 
            { id: "d", text: "1600 kg/m³" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP004", 
        questionText: "A thermometer reads 90°C in boiling water. This is most likely because:", 
        options: [
            { id: "a", text: "Mercury is impure" }, 
            { id: "b", text: "Atmospheric pressure is lower than standard" }, 
            { id: "c", text: "Water is impure" }, 
            { id: "d", text: "Altitude is low" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP005", 
        questionText: "When ice floating in a glass of water melts completely, the water level:", 
        options: [
            { id: "a", text: "Rises" }, 
            { id: "b", text: "Remains the same" }, 
            { id: "c", text: "Falls" }, 
            { id: "d", text: "Doubles" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP006", 
        questionText: "A bucket is completely filled with water at 4°C. If the temperature is decreased to 2°C, the water level will:", 
        options: [
            { id: "a", text: "Increase" }, 
            { id: "b", text: "Decrease" }, 
            { id: "c", text: "Remain same" }, 
            { id: "d", text: "First increase then decrease" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP007", 
        questionText: "Which of the following statements reflects theoretical possibilities about the ultimate fate of the universe?", 
        options: [
            { id: "a", text: "Universe will eventually reach maximum entropy ('heat death') where stars burn out." }, 
            { id: "b", text: "Universe will eventually stop expanding and collapse inward ('Big Crunch')." }, 
            { id: "c", text: "Both (a) and (b) represent theoretical models or possibilities." }, 
            { id: "d", text: "Neither (a) nor (b) are considered theoretical possibilities." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP008", 
        questionText: "Which description best fits the process of calcination in metallurgy?", 
        options: [
            { id: "a", text: "Burning in the presence of high oxygen." }, 
            { id: "b", text: "Converting a metallic oxide into metal." }, 
            { id: "c", text: "Purifying a metal." }, 
            { id: "d", text: "Heating an ore (like carbonate or hydroxide) strongly in the absence or limited supply of air to decompose it." }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP009", 
        questionText: "If the masses of two bodies remain the same, but the Gravitational force between them increases, what must have happened?", 
        options: [
            { id: "a", text: "The value of the Gravitational constant (G) increased." }, 
            { id: "b", text: "The distance between the bodies was halved." }, 
            { id: "c", text: "The distance between the bodies was increased." }, 
            { id: "d", text: "The distance between the bodies was decreased." }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP010", 
        questionText: "In a honeybee colony, which type of bee is fertile and lays eggs?", 
        options: [
            { id: "a", text: "Worker bee" }, 
            { id: "b", text: "Drone bee" }, 
            { id: "c", text: "Both worker and drone bees" }, 
            { id: "d", text: "None of the above" } // Correct answer (Queen Bee) is missing
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP011", 
        questionText: "The acceleration due to gravity 'g' at one point on a planet (e.g., equator) is less than 10.5 m/s², and the average 'g' for the planet is greater than 10.8 m/s². What can be concluded about the value of 'g' at another point (e.g., pole)?", 
        options: [
            { id: "a", text: "Less than 10.5 m/s²" }, 
            { id: "b", text: "Less than 11.2 m/s²" }, 
            { id: "c", text: "Greater than 11.1 m/s²" }, // Modified slightly for clarity
            { id: "d", text: "Greater than 11.6 m/s²" }
        ], 
        correctOptionId: "d" // Logic: If avg > 10.8 and one end < 10.5, the other end must be > (2*10.8 - 10.5) = 11.1. Option D is the strongest correct statement.
    },
    { 
        id: "KP012", 
        questionText: "The focal length of a convex lens is 2.5 cm. What is its power?", // Rephrased from concave to convex to match options
        options: [
            { id: "a", text: "+0.04 D" }, 
            { id: "b", text: "+4 D" }, 
            { id: "c", text: "+40 D" }, 
            { id: "d", text: "+400 D" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP013", 
        questionText: "To experimentally determine the resistivity of wires made from different metals under varying conditions (like temperature), which of the following factors could be treated as an independent variable?", 
        options: [
            { id: "a", text: "Length of the wire" }, 
            { id: "b", text: "Cross-sectional area of the wire" }, 
            { id: "c", text: "Nature (type) of the metal" }, 
            { id: "d", text: "All of the above could be independent variables in different experiments." }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP014", 
        questionText: "A ray of light strikes a plane mirror, making an angle of 40° with the surface of the mirror. What is the angle of reflection?", 
        options: [
            { id: "a", text: "40°" }, 
            { id: "b", text: "50°" }, 
            { id: "c", text: "90°" }, 
            { id: "d", text: "Cannot be determined" }
        ], 
        correctOptionId: "b" // Angle of incidence = 90 - 40 = 50. Angle of reflection = Angle of incidence.
    },
    { 
        id: "KP015", 
        questionText: "A 100W bulb (A) runs for 10 hours. Another bulb (B) runs for 5 hours but consumes more energy than bulb A. Which bulb has more power?", 
        options: [
            { id: "a", text: "Bulb A" }, 
            { id: "b", text: "Bulb B" }, 
            { id: "c", text: "They have equal power" }, 
            { id: "d", text: "Cannot be determined" }
        ], 
        correctOptionId: "b" // Energy = Power * Time. E_A = 100 * 10 = 1000 Wh. E_B > 1000 Wh. P_B = E_B / 5. P_B > 1000/5 = 200 W. So P_B > P_A.
    },
    { 
        id: "KP016", 
        questionText: "Which type of lens usually forms a real image but fails to do so (forms a virtual image) when the object is placed closer than its focal length?", 
        options: [
            { id: "a", text: "Concave lens" }, 
            { id: "b", text: "Convex lens" }, 
            { id: "c", text: "Plane mirror" }, 
            { id: "d", text: "Both concave and convex lens" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP017", 
        questionText: "From a rigorous physics perspective, Moment of Inertia is classified as a:", 
        options: [
            { id: "a", text: "Scalar quantity" }, 
            { id: "b", text: "Vector quantity" }, 
            { id: "c", text: "Tensor quantity" }, 
            { id: "d", text: "Quantity identical to mass" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP018", 
        questionText: "A rocket works on the principle of conservation of:", 
        options: [
            { id: "a", text: "Energy" }, 
            { id: "b", text: "Linear momentum" }, 
            { id: "c", text: "Change in momentum" }, 
            { id: "d", text: "Angular momentum" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP019", 
        questionText: "The product of the average force applied to an object and the time interval over which the force acts is known as:", 
        options: [
            { id: "a", text: "Linear momentum" }, 
            { id: "b", text: "Impulse" }, 
            { id: "c", text: "Work-Energy" }, 
            { id: "d", text: "Torque" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP020", 
        questionText: "Which one of the following substances typically has the greatest viscosity at room temperature?", 
        options: [
            { id: "a", text: "Mercury" }, 
            { id: "b", text: "Water" }, 
            { id: "c", text: "Oxygen (gas)" }, 
            { id: "d", text: "Hydrogen (gas)" }
        ], 
        correctOptionId: "a" // Mercury is much more viscous than water; gases have very low viscosity.
    },
    { 
        id: "KP021", 
        questionText: "Very high temperatures, such as those inside a furnace, are typically measured using a:", 
        options: [
            { id: "a", text: "Mercury thermometer" }, 
            { id: "b", text: "Pyrometer" }, 
            { id: "c", text: "Hygrometer" }, 
            { id: "d", text: "Barometer" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP022", 
        questionText: "The feeding habit of the female Anopheles mosquito is classified as:", 
        options: [
            { id: "a", text: "Frugivorous (fruit-eating)" }, 
            { id: "b", text: "Insectivorous (insect-eating)" }, 
            { id: "c", text: "Sanguivorous (blood-eating)" }, 
            { id: "d", text: "Omnivorous" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP023", 
        questionText: "Which features contribute to the ability of birds to fly?", 
        options: [
            { id: "a", text: "Presence of pneumatic (hollow) bones" }, 
            { id: "b", text: "Presence of air sacs connected to lungs" }, 
            { id: "c", text: "Presence of wings with feathers" }, 
            { id: "d", text: "All of the above" }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP024", 
        questionText: "The process of determining the approximate age of fossils (once-living material) is often called:", 
        options: [
            { id: "a", text: "Carbon dating (for relatively recent organic remains)" }, 
            { id: "b", text: "Radiometric dating (e.g., Uranium dating for older rocks/fossils)" }, 
            { id: "c", text: "Both (a) and (b) are methods used for dating geological/biological samples." }, 
            { id: "d", text: "Fossil reconstruction" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP025", 
        questionText: "Which statement(s) is/are true about X-rays?", 
        options: [
            { id: "a", text: "They are a form of electromagnetic radiation." }, 
            { id: "b", text: "They are generally higher in energy than visible light." }, 
            { id: "c", text: "They are absorbed significantly by dense materials like lead." }, // Corrected typo
            { id: "d", text: "All of the above are true." }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP026", 
        questionText: "A person is standing on a weighing scale inside an elevator. In which situation does the scale show the person's apparent weight as zero (weightlessness)?", 
        options: [
            { id: "a", text: "The elevator is moving down with constant velocity." }, 
            { id: "b", text: "The elevator is moving up with constant velocity." }, 
            { id: "c", text: "The elevator is accelerating downwards with acceleration g (free fall)." }, 
            { id: "d", text: "The elevator is accelerating upwards with acceleration g." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP027", 
        questionText: "When a body is falling freely under gravity (neglecting air resistance), its total mechanical energy (potential + kinetic):", 
        options: [
            { id: "a", text: "Increases continuously." }, 
            { id: "b", text: "Decreases continuously." }, 
            { id: "c", text: "Remains constant." }, 
            { id: "d", text: "First increases then decreases." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP028", 
        questionText: "Two planets have radii R₁ and R₂ and densities d₁ and d₂ respectively. If the acceleration due to gravity on their surfaces are g₁ and g₂, what is the ratio g₁/g₂? (Hint: g = (4/3)πGRd)", 
        options: [
            { id: "a", text: "R₁d₁ : R₂d₂" }, 
            { id: "b", text: "R₁d₂ : R₂d₁" }, 
            { id: "c", text: "R₁²d₁ : R₂²d₂" }, 
            { id: "d", text: "R₁d₁² : R₂d₂²" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP029", 
        questionText: "A piece of ice is floating in a beaker filled with water. When all the ice melts, the water level will:", 
        options: [
            { id: "a", text: "Rise" }, 
            { id: "b", text: "Fall" }, 
            { id: "c", text: "Remain the same" }, 
            { id: "d", text: "First rise then fall" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP030", 
        questionText: "Pascal's law, concerning pressure transmission in fluids, is the principle behind the operation of hydraulic lifts and brakes. Which of the following phenomena is LEAST directly related to Pascal's Law?", 
        options: [
            { id: "a", text: "Hydraulic brakes system" }, 
            { id: "b", text: "Hydraulic lift mechanism" }, 
            { id: "c", text: "Water finding its own level in an Artesian well" }, // Related more to hydrostatic pressure/gravity
            { id: "d", text: "Action of a simple syringe (applying force to transmit pressure)" }
        ], 
        correctOptionId: "c" 
    },
     { 
        id: "KP031", 
        questionText: "A standard mercury barometer is placed in an elevator that is accelerating upwards. The reading of the barometer (height of the mercury column) will be:", 
        options: [
            { id: "a", text: "More than 760 mm of Hg" }, 
            { id: "b", text: "Less than 760 mm of Hg" }, 
            { id: "c", text: "Equal to 760 mm of Hg" }, 
            { id: "d", text: "Zero" }
        ], 
        correctOptionId: "a" // Upward acceleration increases effective 'g', requiring higher pressure (column height) to balance atmospheric pressure.
    },
     { 
        id: "KP032", // Renumbered from second Q31
        questionText: "The specific heat capacity of water is approximately 4200 J/kg°C. What does this value signify?", 
        options: [
            { id: "a", text: "1 kg of water requires 4200 J of heat energy to melt at 0°C." }, 
            { id: "b", text: "1 kg of water releases 4200 J of heat energy when its temperature falls by 1°C (or absorbs 4200 J to rise by 1°C)." }, 
            { id: "c", text: "4200 kg of water requires 1 J of heat energy to raise its temperature by 1°C." }, 
            { id: "d", text: "1 kg of water requires 4200 J of heat energy to boil at 100°C." }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP033", // Renumbered from Q32
        questionText: "On a cold morning, a metal surface feels colder to touch than a wooden surface, even though both are at the same ambient temperature. This is because:", 
        options: [
            { id: "a", text: "Metal has a higher specific heat capacity than wood." }, 
            { id: "b", text: "Metal has a higher thermal conductivity than wood." }, 
            { id: "c", text: "Metal has a lower specific heat capacity than wood." }, 
            { id: "d", text: "Metal has a lower thermal conductivity than wood." }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP034", // Renumbered from Q33
        questionText: "A bimetallic strip is made of metal A and metal B bonded together. When heated, the strip bends with metal A forming the outer curve (longer radius). This indicates that:", 
        options: [
            { id: "a", text: "The coefficient of linear thermal expansion of A is greater than that of B." }, 
            { id: "b", text: "The coefficient of linear thermal expansion of A is less than that of B." }, 
            { id: "c", text: "The specific heat capacity of A is greater than that of B." }, 
            { id: "d", text: "The specific heat capacity of A is less than that of B." }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP035", // Renumbered from Q34
        questionText: "When light travels from a rarer optical medium (like air) to a denser optical medium (like glass), which of the following properties of the light remains unchanged?", 
        options: [
            { id: "a", text: "Wavelength" }, 
            { id: "b", text: "Speed" }, 
            { id: "c", text: "Frequency" }, // Corrected ID from second 'b'
            { id: "d", text: "Amplitude (usually decreases)" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP036", // Renumbered from Q35
        questionText: "A single concave lens always forms an image that is:", 
        options: [
            { id: "a", text: "Real, inverted, diminished" }, 
            { id: "b", text: "Virtual, erect, diminished" }, 
            { id: "c", text: "Real, erect, magnified" }, 
            { id: "d", text: "Virtual, inverted, magnified" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP037", // Renumbered from Q36
        questionText: "The reddish appearance of the sun at sunrise and sunset is primarily due to which phenomenon?", 
        options: [
            { id: "a", text: "Reflection of light from clouds" }, 
            { id: "b", text: "Scattering of sunlight by atmospheric particles (Rayleigh scattering)" }, 
            { id: "c", text: "Total internal reflection of light in the atmosphere" }, 
            { id: "d", text: "Dispersion of light by water droplets" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP038", // Renumbered from Q37
        questionText: "For the phenomenon of total internal reflection to occur, light must travel from:", 
        options: [
            { id: "a", text: "A denser medium to a rarer medium with an angle of incidence greater than the critical angle." }, 
            { id: "b", text: "A rarer medium to a denser medium with an angle of incidence greater than the critical angle." }, 
            { id: "c", text: "A denser medium to a rarer medium with an angle of incidence less than the critical angle." }, 
            { id: "d", text: "Any medium to another medium with an angle of incidence equal to 90°." }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP039", // Renumbered from Q38
        questionText: "Two plane mirrors are inclined to each other at an angle θ. A ray of light incident on the first mirror undergoes reflection and then strikes the second mirror. If the final reflected ray from the second mirror is parallel to the first incident ray, what must the angle θ be?", 
        options: [
            { id: "a", text: "45°" }, 
            { id: "b", text: "60°" }, 
            { id: "c", text: "90°" }, 
            { id: "d", text: "120°" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP040", // Renumbered from Q39
        questionText: "The persistence of hearing, which is the minimum time interval required between two sound impulses for the human ear to distinguish them as separate sounds, is approximately:", 
        options: [
            { id: "a", text: "1 second" }, 
            { id: "b", text: "0.1 second (or 1/10th of a second)" }, 
            { id: "c", text: "0.01 second" }, 
            { id: "d", text: "0.5 second" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP041", // Renumbered from Q40
        questionText: "In which of the following media is the speed of sound typically the maximum?", 
        options: [
            { id: "a", text: "Vacuum" }, 
            { id: "b", text: "Air (at standard temperature)" }, 
            { id: "c", text: "Water" }, 
            { id: "d", text: "Steel" }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP042", // Renumbered from Q41
        questionText: "Two resistors R₁ and R₂ are connected in parallel. Their equivalent resistance Rp satisfies which condition?", 
        options: [
            { id: "a", text: "Rp is always greater than both R₁ and R₂" }, 
            { id: "b", text: "Rp is always less than both R₁ and R₂" }, 
            { id: "c", text: "Rp is always between R₁ and R₂" }, 
            { id: "d", text: "Rp is equal to the sum R₁ + R₂" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP043", // Renumbered from Q42
        questionText: "A wire has an initial resistance R. It is stretched uniformly so that its length doubles. Assuming the volume of the wire remains constant during stretching, what will its new resistance be?", 
        options: [
            { id: "a", text: "R/2" }, 
            { id: "b", text: "R" }, 
            { id: "c", text: "2R" }, 
            { id: "d", text: "4R" } // L -> 2L, A -> A/2. R' = ρ(2L)/(A/2) = 4 * ρL/A = 4R
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP044", // Renumbered from Q43
        questionText: "The Kilowatt-hour (kWh) is a commonly used commercial unit for measuring:", 
        options: [
            { id: "a", text: "Electrical Power" }, 
            { id: "b", text: "Electrical Energy consumption" }, 
            { id: "c", text: "Electric Charge" }, 
            { id: "d", text: "Electric Current" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP045", // Renumbered from Q44
        questionText: "An ideal transformer has 100 turns in the primary coil and 500 turns in the secondary coil. If the voltage applied across the primary is 220 V AC, what is the voltage across the secondary?", 
        options: [
            { id: "a", text: "44 V" }, 
            { id: "b", text: "110 V" }, 
            { id: "c", text: "1100 V" }, 
            { id: "d", text: "2200 V" } // Vs/Vp = Ns/Np => Vs = Vp * (Ns/Np) = 220 * (500/100) = 1100 V
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP046", // Renumbered from Q45
        questionText: "The magnetic field inside a long, straight solenoid carrying a steady current is:", 
        options: [
            { id: "a", text: "Zero" }, 
            { id: "b", text: "Strongest at the ends and decreases towards the center" }, 
            { id: "c", text: "Weakest at the ends and increases towards the center" }, 
            { id: "d", text: "Nearly uniform and parallel to the axis (away from the ends)" }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP047", // Renumbered from Q46
        questionText: "Fleming's Left-Hand Rule is used to determine the direction of:", 
        options: [
            { id: "a", text: "Induced current in a conductor moving in a magnetic field (Generator effect - Use Right Hand Rule)" }, 
            { id: "b", text: "Force experienced by a current-carrying conductor placed in a magnetic field (Motor effect)" }, 
            { id: "c", text: "Magnetic field produced by a current-carrying conductor (Use Right Hand Grip Rule)" }, 
            { id: "d", text: "Direction of magnetic field lines around a bar magnet" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP048", // Renumbered from Q47
        questionText: "Which principal energy transformation occurs in an electrical generator (dynamo)?", 
        options: [
            { id: "a", text: "Electrical energy to Mechanical energy" }, 
            { id: "b", text: "Mechanical energy to Electrical energy" }, 
            { id: "c", text: "Chemical energy to Electrical energy" }, 
            { id: "d", text: "Heat energy to Electrical energy" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP049", // Renumbered from Q48
        questionText: "According to the modern understanding of magnetism, the magnetic properties of materials arise primarily from:", 
        options: [
            { id: "a", text: "The presence of isolated magnetic monopoles (North and South poles)" }, 
            { id: "b", text: "Static electric charges at rest within the material" }, 
            { id: "c", text: "The spin and orbital motion of electrons within atoms" }, 
            { id: "d", text: "The alignment of large magnetic domains only (domains themselves arise from electron effects)" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP050", // Renumbered from Q49
        questionText: "A simple machine has a Mechanical Advantage (MA) of 5 and a Velocity Ratio (VR) of 6. What is its efficiency (η)?", 
        options: [
            { id: "a", text: "120%" }, 
            { id: "b", text: "83.3%" }, // η = MA / VR = 5 / 6 ≈ 0.8333
            { id: "c", text: "1.2%" }, 
            { id: "d", text: "5/6 % (approx 0.83%)" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP051", // Renumbered from Q50
        questionText: "Which of the following is a derived SI unit?", 
        options: [
            { id: "a", text: "Mole (Amount of substance - Base)" }, 
            { id: "b", text: "Hertz (Frequency - Derived: s⁻¹)" }, 
            { id: "c", text: "Candela (Luminous intensity - Base)" }, 
            { id: "d", text: "Kelvin (Temperature - Base)" } // Celsius is derived from Kelvin but not base SI
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP052", // Renumbered from Q51
        questionText: "What is the dimensional formula for frequency?", 
        options: [
            { id: "a", text: "[M⁰ L⁰ T¹]" }, 
            { id: "b", text: "[M⁰ L⁰ T⁻¹]" }, // Frequency = 1 / Time period
            { id: "c", text: "[M¹ L⁰ T⁰]" }, 
            { id: "d", text: "[M⁻¹ L⁰ T⁰]" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP053", // Renumbered from Q52
        questionText: "What is the standard SI unit of electric potential difference (voltage)?", 
        options: [
            { id: "a", text: "Ampere" }, 
            { id: "b", text: "Joule" }, 
            { id: "c", text: "Watt" }, 
            { id: "d", text: "Volt" }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP054", // Renumbered from Q53
        questionText: "How many quintals are equivalent to 1 metric ton?", 
        options: [
            { id: "a", text: "10 Quintals" }, // 1 metric ton = 1000 kg; 1 quintal = 100 kg
            { id: "b", text: "1000 Quintals" }, 
            { id: "c", text: "100 Quintals" }, 
            { id: "d", text: "1 Quintal" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP055", // Renumbered from Q54
        questionText: "A gas thermometer is generally considered more sensitive than a liquid thermometer (like mercury) primarily because:", 
        options: [
            { id: "a", text: "Gases generally have a much larger coefficient of thermal expansion than liquids." }, 
            { id: "b", text: "Gases are more easily obtained than pure liquids." }, 
            { id: "c", text: "Gases are much lighter than liquids." }, 
            { id: "d", text: "Gases do not change their state (boil/freeze) as easily over common temperature ranges." }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP056", // Renumbered from Q55
        questionText: "A rider sitting on the back of a horse falls backward when the horse suddenly starts running forward. This happens due to:", 
        options: [
            { id: "a", text: "The inertia of rest of the rider's upper body." }, 
            { id: "b", text: "The inertia of motion of the horse." }, 
            { id: "c", text: "Newton's third law of motion (action-reaction)." }, 
            { id: "d", text: "Frictional force between the rider and the horse." }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP057", // Renumbered from Q56
        questionText: "Which of the following are examples of secondary (rechargeable) electrochemical cells?", 
        options: [
            { id: "a", text: "Dry cell (Leclanché cell - Primary)" }, 
            { id: "b", text: "Lead-acid cell (Car battery - Secondary)" }, 
            { id: "c", text: "Alkaline cell (like common AA batteries - Usually Primary, though rechargeable versions exist)" }, 
            { id: "d", text: "Both Lead-acid cells and rechargeable Alkaline cells are secondary cells." } // Best fit, includes common car battery
        ], 
        correctOptionId: "d" 
    },
     { 
        id: "KP058", // Renumbered from Q57
        questionText: "Nichrome wire, commonly used as a heating element, is an alloy. A typical composition includes Nickel (Ni). Which percentage is a common value for Nickel content in Nichrome?", 
        options: [
            { id: "a", text: "around 40%" }, 
            { id: "b", text: "around 50%" }, 
            { id: "c", text: "around 60% to 80%" }, // Common types are 80% Ni, 20% Cr or ~60% Ni, 15% Cr, rest Fe
            { id: "d", text: "around 70%" }
        ], 
        correctOptionId: "c" // Choose the range that covers common compositions
    },
    { 
        id: "KP059", // Renumbered from Q58
        questionText: "In the geological time scale, the Archean Eon corresponds approximately to the period:", 
        options: [
            { id: "a", text: "4.0 to 2.5 Billion years ago" }, 
            { id: "b", text: "2.5 to 0.54 Billion years ago (Proterozoic)" }, 
            { id: "c", text: "4.5 to 4.0 Billion years ago (Hadean)" }, 
            { id: "d", text: "0.54 Billion years ago to present day (Phanerozoic)" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP060", // Renumbered from Q59
        questionText: "Which geological era is often referred to as the 'Age of Reptiles' due to the dominance of dinosaurs and other large reptiles?", 
        options: [
            { id: "a", text: "Paleozoic Era" }, 
            { id: "b", text: "Mesozoic Era" }, 
            { id: "c", text: "Cenozoic Era" }, 
            { id: "d", text: "Precambrian Time" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP061", // Renumbered from Q60
        questionText: "A person is standing perfectly still on a surface with absolutely zero friction (a 100% frictionless surface). How can they initiate movement across the surface?", 
        options: [
            { id: "a", text: "By trying to sprint forward (legs will slip)." }, 
            { id: "b", text: "By trying to walk slowly (feet will slip)." }, 
            { id: "c", text: "By throwing something (like a shoe) horizontally or sneezing/coughing forcefully (Newton's 3rd Law)." }, 
            { id: "d", text: "It is impossible to move without external help." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP062", // Renumbered from Q61
        questionText: "The blue color of the clear daytime sky is mainly due to:", 
        options: [
            { id: "a", text: "Scattering of sunlight by air molecules (Rayleigh scattering)." }, 
            { id: "b", text: "Refraction of sunlight through atmospheric layers." }, 
            { id: "c", text: "Optical illusion known as a mirage." }, 
            { id: "d", text: "Total internal reflection of light in the upper atmosphere." }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP063", // Renumbered from Q62
        questionText: "A standard compound microscope, used for viewing very small objects, typically consists of:", 
        options: [
            { id: "a", text: "One convex lens" }, 
            { id: "b", text: "Two convex lenses (Objective and Eyepiece)" }, 
            { id: "c", text: "Three convex lenses" }, 
            { id: "d", text: "Two concave lenses" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP064", // Renumbered from Q63
        questionText: "Which silver compound is widely used in traditional black and white photography due to its light sensitivity, forming the basis of photographic film and paper?", 
        options: [
            { id: "a", text: "Silver Nitrate (AgNO₃)" }, 
            { id: "b", text: "Silver Sulfate (Ag₂SO₄)" }, 
            { id: "c", text: "Silver Carbonate (Ag₂CO₃)" }, 
            { id: "d", text: "Silver Bromide (AgBr) or Silver Chloride (AgCl)" }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP065", // Renumbered from Q64
        questionText: "A terrestrial telescope, designed for viewing distant objects on Earth and producing an upright image, typically uses how many lenses (or lens groups)?", 
        options: [
            { id: "a", text: "1" }, 
            { id: "b", text: "2 (like an astronomical telescope, giving inverted image)" }, 
            { id: "c", text: "3 (Objective, Eyepiece, and an Erecting lens/prism system)" }, 
            { id: "d", text: "4" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP066", // Renumbered from Q65
        questionText: "Dinosaurs were the dominant terrestrial vertebrates during which geological era?", 
        options: [
            { id: "a", text: "Mesozoic Era" }, 
            { id: "b", text: "Paleozoic Era" }, 
            { id: "c", text: "Cenozoic Era" }, 
            { id: "d", text: "Azoic Era (Precambrian)" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP067", // Renumbered from Q66
        questionText: "A block of wood floats in water with 2/3 of its volume submerged. When the same block floats in oil, 3/4 of its volume is submerged. What is the ratio of the density of the oil to the density of water?", 
        options: [
            { id: "a", text: "8/9" }, // d_wood = (2/3)d_water. d_wood = (3/4)d_oil. (2/3)d_water = (3/4)d_oil. d_oil/d_water = (2/3) / (3/4) = (2/3) * (4/3) = 8/9
            { id: "b", text: "9/8" }, 
            { id: "c", text: "2/3" }, 
            { id: "d", text: "3/4" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP068", // Renumbered from Q67
        questionText: "The dimensional formula for the universal Gravitational Constant (G) is:", 
        options: [
            { id: "a", text: "[M L T⁻²]" }, // Force
            { id: "b", text: "[M⁻¹ L³ T⁻²]" }, // F = G m1 m2 / r^2 => G = F r^2 / (m1 m2) => [M L T⁻²] [L²] / [M²] = [M⁻¹ L³ T⁻²]
            { id: "c", text: "[M L² T⁻²]" }, // Energy/Work
            { id: "d", text: "[M⁻¹ L² T⁻¹]" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP069", // Renumbered from Q68
        questionText: "A body starts from rest and moves with uniform acceleration 'a'. What is the ratio of the distance covered in the nth second to the total distance covered in n seconds?", 
        options: [
            { id: "a", text: "(2n-1) / n²" }, // S_nth = u + a/2(2n-1) = a/2(2n-1). S_n = ut + 1/2 at^2 = 1/2 an^2. Ratio = [a/2(2n-1)] / [1/2 an^2] = (2n-1)/n^2
            { id: "b", text: "(2n+1) / n²" }, 
            { id: "c", text: "1 / n" }, 
            { id: "d", text: "2 / n" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP070", // Renumbered from Q69
        questionText: "Which of the following forces is classified as a non-conservative force, meaning the work done by it depends on the path taken?", 
        options: [
            { id: "a", text: "Gravitational force" }, 
            { id: "b", text: "Electrostatic force" }, 
            { id: "c", text: "Frictional force" }, 
            { id: "d", text: "Elastic spring force (ideal)" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP071", // Renumbered from Q70
        questionText: "The tendency of the surface of a liquid to shrink into the minimum possible surface area is due to the property called:", 
        options: [
            { id: "a", text: "Viscosity" }, 
            { id: "b", text: "Surface Tension" }, 
            { id: "c", text: "Elasticity" }, 
            { id: "d", text: "Buoyancy" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP072", // Renumbered from Q71
        questionText: "Who is widely regarded as the 'Father of Classical Mechanics' for formulating the laws of motion and the law of universal gravitation?", 
        options: [
            { id: "a", text: "Galileo Galilei" }, 
            { id: "b", text: "Isaac Newton" }, 
            { id: "c", text: "Albert Einstein" }, 
            { id: "d", text: "James Clerk Maxwell" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP073", // Renumbered from Q72
        questionText: "Who developed the special and general theories of relativity, revolutionizing our understanding of space, time, gravity, and the universe, and is considered the 'Father of Relativity'?", 
        options: [
            { id: "a", text: "Isaac Newton" }, 
            { id: "b", text: "Max Planck" }, 
            { id: "c", text: "Albert Einstein" }, 
            { id: "d", text: "Niels Bohr" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP074", // Renumbered from Q73
        questionText: "Who is often called the 'Father of Observational Astronomy', 'Father of Modern Physics', or 'Father of Modern Science' due to his emphasis on observation, experimentation, and quantitative measurement?", 
        options: [
            { id: "a", text: "Archimedes" }, 
            { id: "b", text: "Isaac Newton" }, 
            { id: "c", text: "Galileo Galilei" }, 
            { id: "d", text: "Michael Faraday" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP075", // Renumbered from Q74
        questionText: "Who formulated a set of equations that unified electricity, magnetism, and light, establishing that light is an electromagnetic wave, earning him the title 'Father of Electrodynamics'?", 
        options: [
            { id: "a", text: "Michael Faraday" }, 
            { id: "b", text: "André-Marie Ampère" }, 
            { id: "c", text: "James Clerk Maxwell" }, 
            { id: "d", text: "Hans Christian Ørsted" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP076", // Renumbered from Q75
        questionText: "Whose pioneering work on radioactivity, including the discovery of the atomic nucleus through the gold foil experiment, led to him being called the 'Father of Nuclear Physics'?", 
        options: [
            { id: "a", text: "Marie Curie" }, 
            { id: "b", text: "Ernest Rutherford" }, 
            { id: "c", text: "Enrico Fermi" }, 
            { id: "d", text: "J.J. Thomson" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP077", // Renumbered from Q76
        questionText: "Which ancient Greek mathematician, physicist, and engineer is credited with discovering the principle of buoyancy, famously associated with the exclamation 'Eureka!'?", 
        options: [
            { id: "a", text: "Pythagoras" }, 
            { id: "b", text: "Euclid" }, 
            { id: "c", text: "Archimedes" }, 
            { id: "d", text: "Ptolemy" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP078", // Renumbered from Q77
        questionText: "Who introduced the revolutionary concept that energy is quantized (comes in discrete packets called quanta), laying the foundation for quantum mechanics and known as the 'Father of Quantum Theory'?", 
        options: [
            { id: "a", text: "Albert Einstein" }, 
            { id: "b", text: "Max Planck" }, 
            { id: "c", text: "Niels Bohr" }, 
            { id: "d", text: "Werner Heisenberg" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP079", // Renumbered from Q78
        questionText: "Who is often regarded as a key figure in the foundation of thermodynamics, particularly for his theoretical work on the efficiency of heat engines and the concept of the Carnot cycle, sometimes called a 'Father of Thermodynamics'?", 
        options: [
            { id: "a", text: "James Prescott Joule" }, 
            { id: "b", text: "Sadi Carnot" }, 
            { id: "c", text: "Rudolf Clausius" }, 
            { id: "d", text: "Lord Kelvin (William Thomson)" }
        ], 
        correctOptionId: "b" // Carnot laid crucial groundwork. Clausius and Kelvin formulated laws explicitly.
    },
    { 
        id: "KP080", // Renumbered from Q79
        questionText: "Who discovered the electron in 1897 using cathode ray tubes and determined its charge-to-mass ratio?", 
        options: [
            { id: "a", text: "Ernest Rutherford" }, 
            { id: "b", text: "J.J. Thomson" }, 
            { id: "c", text: "Robert Millikan" }, 
            { id: "d", text: "James Chadwick" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP081", // Renumbered from Q80
        questionText: "Who discovered the neutron in 1932, completing the picture of the fundamental particles within the atomic nucleus?", 
        options: [
            { id: "a", text: "J.J. Thomson" }, 
            { id: "b", text: "Ernest Rutherford" }, 
            { id: "c", text: "James Chadwick" }, 
            { id: "d", text: "Niels Bohr" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP082", // Renumbered from Q81
        questionText: "Following his discovery of the nucleus, who proposed the 'planetary model' of the atom, suggesting that electrons orbit a small, dense, positively charged nucleus?", 
        options: [
            { id: "a", text: "J.J. Thomson" }, 
            { id: "b", text: "Ernest Rutherford" }, 
            { id: "c", text: "Niels Bohr" }, 
            { id: "d", text: "John Dalton" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP083", // Renumbered from Q82
        questionText: "Who refined Rutherford's atomic model by incorporating quantum theory, proposing that electrons exist only in specific, quantized energy levels or orbits around the nucleus?", 
        options: [
            { id: "a", text: "Ernest Rutherford" }, 
            { id: "b", text: "Albert Einstein" }, 
            { id: "c", text: "Niels Bohr" }, 
            { id: "d", text: "Max Planck" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP084", // Renumbered from Q83
        questionText: "Who made fundamental contributions to the study of electromagnetism, discovering electromagnetic induction, diamagnetism, and the laws of electrolysis?", 
        options: [
            { id: "a", text: "James Clerk Maxwell" }, 
            { id: "b", text: "André-Marie Ampère" }, 
            { id: "c", text: "Michael Faraday" }, 
            { id: "d", text: "Alessandro Volta" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP085", // Renumbered from Q84
        questionText: "Who experimentally established the relationship between the pressure and volume of a gas at constant temperature, now known as Boyle's Law?", 
        options: [
            { id: "a", text: "Jacques Charles" }, 
            { id: "b", text: "Joseph Louis Gay-Lussac" }, 
            { id: "c", text: "Robert Boyle" }, 
            { id: "d", text: "Amedeo Avogadro" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP086", // Renumbered from Q85
        questionText: "Who proposed the law of partial pressures, stating that the total pressure exerted by a mixture of non-reacting gases is equal to the sum of the partial pressures of the individual gases?", 
        options: [
            { id: "a", text: "Robert Boyle" }, 
            { id: "b", text: "John Dalton" }, 
            { id: "c", text: "Jacques Charles" }, 
            { id: "d", text: "Amedeo Avogadro" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP087", // Renumbered from Q86
        questionText: "Who is credited with the invention of the first electric battery, known as the voltaic pile?", 
        options: [
            { id: "a", text: "Michael Faraday" }, 
            { id: "b", text: "André-Marie Ampère" }, 
            { id: "c", text: "Alessandro Volta" }, 
            { id: "d", text: "Georg Ohm" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP088", // Renumbered from Q87
        questionText: "Who formulated the uncertainty principle, a fundamental concept in quantum mechanics stating that there is a limit to the precision with which certain pairs of physical properties of a particle (like position and momentum) can be simultaneously known?", 
        options: [
            { id: "a", text: "Erwin Schrödinger" }, 
            { id: "b", text: "Werner Heisenberg" }, 
            { id: "c", text: "Paul Dirac" }, 
            { id: "d", text: "Max Born" }
        ], 
        correctOptionId: "b" 
    }
[
    { 
        id: "KP089", // Renumbered from Q88
        questionText: "Who developed a fundamental equation in quantum mechanics that describes how the quantum state (wave function) of a physical system changes over time?", 
        options: [
            { id: "a", text: "Werner Heisenberg" }, 
            { id: "b", text: "Louis de Broglie" }, 
            { id: "c", text: "Erwin Schrödinger" }, 
            { id: "d", text: "Niels Bohr" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP090", // Renumbered from Q89
        questionText: "Who is widely recognized for his pioneering work in developing long-distance radio transmission and wireless telegraphy, often called the 'Father of Radio'?", 
        options: [
            { id: "a", text: "Nikola Tesla" }, 
            { id: "b", text: "Guglielmo Marconi" }, 
            { id: "c", text: "Heinrich Hertz" }, 
            { id: "d", text: "James Clerk Maxwell" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP091", // Renumbered from Q90
        questionText: "Who is widely regarded as the visionary architect and principal figure behind India's atomic energy program, often called the 'Father of the Indian Nuclear Programme'?", 
        options: [
            { id: "a", text: "C.V. Raman" }, 
            { id: "b", text: "Homi J. Bhabha" }, 
            { id: "c", text: "Satyendra Nath Bose" }, 
            { id: "d", text: "Vikram Sarabhai" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP092", // Renumbered from Q91
        questionText: "Who discovered X-rays in 1895, a form of electromagnetic radiation, while experimenting with cathode ray tubes?", 
        options: [
            { id: "a", text: "Henri Becquerel" }, 
            { id: "b", text: "Marie Curie" }, 
            { id: "c", text: "Wilhelm Conrad Roentgen" }, 
            { id: "d", text: "J.J. Thomson" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP093", // Renumbered from Q92
        questionText: "Who discovered the phenomenon of spontaneous radioactivity in uranium salts in 1896?", 
        options: [
            { id: "a", text: "Wilhelm Conrad Roentgen" }, 
            { id: "b", text: "Marie Curie" }, 
            { id: "c", text: "Pierre Curie" }, 
            { id: "d", text: "Henri Becquerel" }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP094", // Renumbered from Q93
        questionText: "Who formulated the fundamental law relating voltage (potential difference), current, and resistance in an electrical circuit, known as Ohm's Law?", 
        options: [
            { id: "a", text: "Alessandro Volta" }, 
            { id: "b", text: "André-Marie Ampère" }, 
            { id: "c", text: "Georg Ohm" }, 
            { id: "d", text: "Michael Faraday" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP095", // Renumbered from Q94
        questionText: "Based on his unification of electricity and magnetism, who theoretically predicted the existence of electromagnetic waves that travel at the speed of light?", 
        options: [
            { id: "a", text: "Michael Faraday" }, 
            { id: "b", text: "Heinrich Hertz (later experimentally confirmed them)" }, 
            { id: "c", text: "James Clerk Maxwell" }, 
            { id: "d", text: "Guglielmo Marconi" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP096", // Renumbered from Q95
        questionText: "Who formulated the principle that pressure applied to an enclosed fluid is transmitted undiminished to every portion of the fluid and the walls of the containing vessel, which underlies hydraulic systems?", 
        options: [
            { id: "a", text: "Archimedes" }, 
            { id: "b", text: "Blaise Pascal" }, 
            { id: "c", text: "Daniel Bernoulli" }, 
            { id: "d", text: "Evangelista Torricelli" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP097", // Renumbered from Q96
        questionText: "One picosecond (ps) is equal to:", 
        options: [
            { id: "a", text: "10⁻⁹ seconds (nanosecond)" }, 
            { id: "b", text: "10⁻¹² seconds" }, 
            { id: "c", text: "10⁻¹⁵ seconds (femtosecond)" }, 
            { id: "d", text: "10⁻⁶ seconds (microsecond)" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP098", // Renumbered from Q97
        questionText: "One nanometer (nm) is equivalent to:", 
        options: [
            { id: "a", text: "10⁻⁶ meters (micrometer)" }, 
            { id: "b", text: "10⁻⁹ meters" }, 
            { id: "c", text: "10⁻¹⁰ meters (Angstrom)" }, 
            { id: "d", text: "10⁻¹² meters (picometer)" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP099", // Renumbered from Q98
        questionText: "The SI prefix 'Giga' (G) represents a multiplication factor of:", 
        options: [
            { id: "a", text: "10⁶ (Mega)" }, 
            { id: "b", text: "10⁹" }, 
            { id: "c", text: "10¹² (Tera)" }, 
            { id: "d", text: "10⁻⁹ (nano)" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP100", // Renumbered from Q99
        questionText: "How many milligrams (mg) are there in 0.5 kilograms (kg)?", 
        options: [
            { id: "a", text: "500 mg" }, 
            { id: "b", text: "5,000 mg" }, 
            { id: "c", text: "50,000 mg" }, 
            { id: "d", text: "500,000 mg" } // 0.5 kg = 0.5 * 1000 g = 500 g = 500 * 1000 mg
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP101", // Renumbered from Q100
        questionText: "A speed of 72 kilometers per hour (km/h) is equal to how many meters per second (m/s)?", 
        options: [
            { id: "a", text: "10 m/s" }, 
            { id: "b", text: "15 m/s" }, 
            { id: "c", text: "20 m/s" }, // 72 * (1000 m / 3600 s) = 72 * (5/18) m/s = 4 * 5 = 20 m/s
            { id: "d", text: "25 m/s" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP102", // Renumbered from Q101
        questionText: "The light-year (ly) is a unit used in astronomy to measure:", 
        options: [
            { id: "a", text: "Time" }, 
            { id: "b", text: "Distance" }, 
            { id: "c", text: "Speed" }, 
            { id: "d", text: "Luminosity" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP103", // Renumbered from Q102
        questionText: "One Astronomical Unit (AU) is defined as approximately the average distance between:", 
        options: [
            { id: "a", text: "The Earth and the Moon" }, 
            { id: "b", text: "The Earth and the Sun" }, 
            { id: "c", text: "The Sun and Mars" }, 
            { id: "d", text: "The Sun and Jupiter" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP104", // Renumbered from Q103
        questionText: "One Parsec (pc), a unit of distance used in astronomy, is approximately equal to:", 
        options: [
            { id: "a", text: "1.50 light-years" }, 
            { id: "b", text: "3.26 light-years" }, 
            { id: "c", text: "9.46 light-years (distance light travels in 1 year)" }, 
            { id: "d", text: "11.2 light-years" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP105", // Renumbered from Q104
        questionText: "Kilowatt-hour (kWh) is the standard commercial unit used by utility companies to bill consumers for:", 
        options: [
            { id: "a", text: "Electrical power capacity" }, 
            { id: "b", text: "Electrical charge delivered" }, 
            { id: "c", text: "Electrical energy consumed" }, 
            { id: "d", text: "Peak electrical potential" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP106", // Renumbered from Q105
        questionText: "One horsepower (hp), a unit of power often used for engines and motors, is approximately equal to:", 
        options: [
            { id: "a", text: "550 Watts" }, 
            { id: "b", text: "746 Watts" }, 
            { id: "c", text: "1000 Watts (1 kilowatt)" }, 
            { id: "d", text: "1 Joule per second (1 Watt)" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP107", // Renumbered from Q106
        questionText: "One quintal is a unit of mass equal to:", 
        options: [
            { id: "a", text: "10 kg" }, 
            { id: "b", text: "100 kg" }, 
            { id: "c", text: "1000 kg (1 metric ton)" }, 
            { id: "d", text: "1 kg" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP108", // Renumbered from Q107
        questionText: "One metric tonne (or ton) is a unit of mass equal to:", 
        options: [
            { id: "a", text: "100 kg (1 quintal)" }, 
            { id: "b", text: "1000 kg" }, 
            { id: "c", text: "10 quintals" }, 
            { id: "d", text: "Both b and c are correct" }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP109", // Renumbered from Q108
        questionText: "The SI prefix 'femto' (f) represents a multiplication factor of:", 
        options: [
            { id: "a", text: "10⁻⁹ (nano)" }, 
            { id: "b", text: "10⁻¹² (pico)" }, 
            { id: "c", text: "10⁻¹⁵" }, 
            { id: "d", text: "10⁻¹⁸ (atto)" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP110", // Renumbered from Q109
        questionText: "How many cubic centimeters (cm³ or cc) are there in one liter (L)?", 
        options: [
            { id: "a", text: "10 cm³" }, 
            { id: "b", text: "100 cm³" }, 
            { id: "c", text: "1000 cm³" }, // 1 L = 1 dm³ = (10 cm)³ = 1000 cm³
            { id: "d", text: "10000 cm³" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP111", // Renumbered from Q110
        questionText: "The unit Angstrom (Å), commonly used to express atomic dimensions or wavelengths of light, is equal to:", 
        options: [
            { id: "a", text: "10⁻⁸ m" }, 
            { id: "b", text: "10⁻⁹ m (nanometer)" }, 
            { id: "c", text: "10⁻¹⁰ m" }, 
            { id: "d", text: "10⁻¹² m (picometer)" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP112", // Renumbered from Q111
        questionText: "One standard atmosphere (atm) of pressure, approximately equal to the average atmospheric pressure at sea level, is equivalent to about:", 
        options: [
            { id: "a", text: "101.3 Pa" }, 
            { id: "b", text: "1013 Pa" }, 
            { id: "c", text: "1.013 x 10⁵ Pa (or 101.3 kPa)" }, 
            { id: "d", text: "1.013 x 10⁶ Pa" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP113", // Renumbered from Q112
        questionText: "The unit 'dyne' is the unit of which physical quantity in the CGS (Centimeter-Gram-Second) system?", 
        options: [
            { id: "a", text: "Energy" }, 
            { id: "b", text: "Force" }, 
            { id: "c", text: "Power" }, 
            { id: "d", text: "Pressure" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP114", // Renumbered from Q113
        questionText: "One Newton (N), the SI unit of force, is equal to how many dynes?", 
        options: [
            { id: "a", text: "10³ dynes" }, 
            { id: "b", text: "10⁴ dynes" }, 
            { id: "c", text: "10⁵ dynes" }, // 1 N = 1 kg m/s² = (1000 g)(100 cm)/s² = 100000 g cm/s² = 10⁵ dynes
            { id: "d", text: "10⁷ dynes" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP115", // Renumbered from Q114
        questionText: "The unit 'erg' is the unit of which physical quantity in the CGS system?", 
        options: [
            { id: "a", text: "Force" }, 
            { id: "b", text: "Power" }, 
            { id: "c", text: "Energy (or Work)" }, 
            { id: "d", text: "Momentum" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP116", // Renumbered from Q115
        questionText: "One Joule (J), the SI unit of energy or work, is equal to how many ergs?", 
        options: [
            { id: "a", text: "10³ ergs" }, 
            { id: "b", text: "10⁵ ergs" }, 
            { id: "c", text: "10⁷ ergs" }, // 1 J = 1 N m = (10⁵ dynes)(100 cm) = 10⁷ dyne cm = 10⁷ ergs
            { id: "d", text: "10⁹ ergs" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP117", // Renumbered from Q116
        questionText: "Which of the following is a standard unit for measuring angular velocity?", 
        options: [
            { id: "a", text: "meters per second (m/s) (Linear velocity)" }, 
            { id: "b", text: "radians (rad) (Angle)" }, 
            { id: "c", text: "radians per second (rad/s)" }, 
            { id: "d", text: "meters per second squared (m/s²) (Linear acceleration)" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP118", // Renumbered from Q117
        questionText: "The 'Tesla' (T) is the SI unit used to measure:", 
        options: [
            { id: "a", text: "Magnetic Flux (Weber - Wb)" }, 
            { id: "b", text: "Magnetic Field Strength (or Magnetic Flux Density)" }, 
            { id: "c", text: "Electric Field Strength (N/C or V/m)" }, 
            { id: "d", text: "Electric Flux (V m)" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP119", // Renumbered from Q118
        questionText: "One Atomic Mass Unit (amu or u) is defined as approximately:", 
        options: [
            { id: "a", text: "The mass of a single electron" }, 
            { id: "b", text: "The mass of a single proton" }, 
            { id: "c", text: "Exactly 1/12th the mass of a neutral Carbon-12 atom" }, 
            { id: "d", text: "The mass of a Helium-4 nucleus" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP120", // Renumbered from Q119
        questionText: "The dimensional formula for Power (Rate of energy transfer or work done) is:", 
        options: [
            { id: "a", text: "[M L T⁻²] (Force)" }, 
            { id: "b", text: "[M L² T⁻²] (Energy/Work)" }, 
            { id: "c", text: "[M L² T⁻³]" }, // Power = Energy / Time = [M L² T⁻²] / [T] = [M L² T⁻³]
            { id: "d", text: "[M L T⁻¹] (Momentum)" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP121", // Renumbered from Q120
        questionText: "The unit 'Pascal' (Pa), the SI unit of pressure, is equivalent to:", 
        options: [
            { id: "a", text: "Newton per meter (N/m) (Surface tension)" }, 
            { id: "b", text: "Newton per square meter (N/m²)" }, // Pressure = Force / Area
            { id: "c", text: "Joule per meter (J/m) (Force)" }, 
            { id: "d", text: "Joule per square meter (J/m²)" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP122", // Combined the two Q121 into KP122 and KP123
        questionText: "Ignoring air resistance, at what angle should a projectile be launched from the ground to achieve the maximum horizontal range?", 
        options: [
            { id: "a", text: "30°" }, 
            { id: "b", text: "45°" }, 
            { id: "c", text: "60°" }, 
            { id: "d", text: "90° (Vertical launch, zero range)" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP123", // Original second Q121
        questionText: "Relative to an observer on the ground, what is the typical shape of the path (trajectory) of a projectile thrown horizontally from a moving airplane (neglecting air resistance)?", 
        options: [
            { id: "a", text: "Parabolic" }, 
            { id: "b", text: "Straight line downwards" }, 
            { id: "c", text: "Wave-like" }, 
            { id: "d", text: "Circular arc" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP124", // Renumbered from Q122, corrected duplicate option
        questionText: "Which of the following forces is NOT a conservative force (work done depends on path)?", 
        options: [
            { id: "a", text: "Electrostatic force" }, 
            { id: "b", text: "Gravitational force" }, 
            { id: "c", text: "Frictional force" }, 
            { id: "d", text: "Ideal elastic spring force" } // Removed duplicate Electrostatic
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP125", // Renumbered from Q123
        questionText: "A stone is dropped from rest from a height 'h'. The time taken to fall the first half of the distance (h/2) is t₁. The time taken to fall the remaining half of the distance (from h/2 to h) is t₂. Neglecting air resistance, how do t₁ and t₂ compare?", 
        options: [
            { id: "a", text: "t₁ > t₂" }, // Speed increases, so covers second half faster
            { id: "b", text: "t₁ < t₂" }, 
            { id: "c", text: "t₁ = t₂" }, 
            { id: "d", text: "The relation depends on the value of h" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP126", // Renumbered from Q124
        questionText: "An object weighs 100 N in air and 80 N when fully submerged in water. What is the volume of the object? (Take g = 10 m/s² and density of water ρ_w = 1000 kg/m³)", 
        options: [
            { id: "a", text: "0.002 m³" }, // Buoyant force = Weight loss = 100 N - 80 N = 20 N. Buoyant force = V * ρ_w * g. V = 20 N / (1000 kg/m³ * 10 m/s²) = 20 / 10000 m³ = 0.002 m³
            { id: "b", text: "0.008 m³" }, 
            { id: "c", text: "0.010 m³" }, 
            { id: "d", text: "0.020 m³" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP127", // Renumbered from Q125
        questionText: "A hydraulic press has pistons with areas in the ratio 1:20 (small:large). If a force of 50 N is applied to the smaller piston, what is the maximum load that can ideally be lifted by the larger piston?", // Simplified to ideal case first
        options: [
            { id: "a", text: "800 N" }, 
            { id: "b", text: "1000 N" }, // P₁ = P₂ => F₁/A₁ = F₂/A₂ => F₂ = F₁ * (A₂/A₁) = 50 N * (20/1) = 1000 N
            { id: "c", text: "1250 N" }, 
            { id: "d", text: "25 N" } 
        ], 
        correctOptionId: "b" // Note: The original Q asked for 80% efficiency load -> 0.80 * 1000N = 800N. Let's keep the question focused on the ideal principle first.
    },
    { 
        id: "KP128", // Renumbered from Q126
        questionText: "A boy pushes against a stationary wall with a constant force of 50 N for 10 seconds. The wall does not move. How much work is done by the boy on the wall?", 
        options: [
            { id: "a", text: "0 J" }, // Work = Force * Distance. Since Distance = 0, Work = 0.
            { id: "b", text: "50 J" }, 
            { id: "c", text: "500 J" }, 
            { id: "d", text: "5 J" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP129", // Renumbered from Q127
        questionText: "A machine lifts a load of 200 N vertically through a height of 5 m. This requires an effort of 50 N moving through a distance of 30 m. What is the efficiency of the machine?", 
        options: [
            { id: "a", text: "100%" }, 
            { id: "b", text: "80%" }, 
            { id: "c", text: "75%" }, 
            { id: "d", text: "66.7%" } // Output Work = Load * Load Distance = 200 N * 5 m = 1000 J. Input Work = Effort * Effort Distance = 50 N * 30 m = 1500 J. Efficiency = (Output/Input) * 100% = (1000/1500) * 100% = (2/3) * 100% ≈ 66.7%
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP130", // Renumbered from Q128
        questionText: "100 g of water at 80°C is mixed with 200 g of water at 10°C. Assuming no heat loss to the surroundings, what is the final equilibrium temperature of the mixture?", 
        options: [
            { id: "a", text: "30°C" }, 
            { id: "b", text: "33.3°C" }, // Heat lost by hot = Heat gained by cold. m₁c(T_hot - T_final) = m₂c(T_final - T_cold). (100)(80 - T_f) = (200)(T_f - 10). 8000 - 100T_f = 200T_f - 2000. 10000 = 300T_f. T_f = 10000/300 = 100/3 ≈ 33.3°C
            { id: "c", text: "45°C" }, 
            { id: "d", text: "50°C" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP131", // Renumbered from Q129
        questionText: "A concave mirror produces a real, inverted image that is exactly the same size as the object. Where must the object be placed?", 
        options: [
            { id: "a", text: "At infinity" }, 
            { id: "b", text: "Between the focal point (F) and the center of curvature (C)" }, 
            { id: "c", text: "At the focal point (F)" }, 
            { id: "d", text: "At the center of curvature (C)" }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP132", // Renumbered from Q130
        questionText: "The refractive index of a certain type of glass is 1.5. What is the speed of light in this glass? (Speed of light in vacuum c ≈ 3 x 10⁸ m/s)", 
        options: [
            { id: "a", text: "1.5 x 10⁸ m/s" }, 
            { id: "b", text: "2.0 x 10⁸ m/s" }, // n = c/v => v = c/n = (3 x 10⁸ m/s) / 1.5 = 2 x 10⁸ m/s
            { id: "c", text: "3.0 x 10⁸ m/s" }, 
            { id: "d", text: "4.5 x 10⁸ m/s" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP133", // Renumbered from Q131
        questionText: "A lens has a power of -2.5 Diopters (D). What is its focal length and what type of lens is it?", 
        options: [
            { id: "a", text: "-40 cm, Concave" }, // f = 1/P = 1 / (-2.5) m = -0.4 m = -40 cm. Negative power means concave lens.
            { id: "b", text: "+40 cm, Convex" }, 
            { id: "c", text: "-25 cm, Concave" }, 
            { id: "d", text: "+25 cm, Convex" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP134", // Renumbered from Q132
        questionText: "A person stands 68 meters away from a large vertical cliff and shouts. How long will it take for the person to hear the echo? (Assume the speed of sound in air is 340 m/s)", 
        options: [
            { id: "a", text: "0.1 s" }, 
            { id: "b", text: "0.2 s" }, 
            { id: "c", text: "0.4 s" }, // Total distance = 2 * 68 m = 136 m. Time = Distance / Speed = 136 m / 340 m/s = 0.4 s
            { id: "d", text: "0.5 s" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP135", // Renumbered from Q133
        questionText: "Two resistors of 3 Ω and 6 Ω are connected in parallel. This parallel combination is then connected in series with a 4 Ω resistor. What is the equivalent resistance of the entire circuit?", 
        options: [
            { id: "a", text: "6 Ω" }, // R_parallel = (3*6)/(3+6) = 18/9 = 2 Ω. R_total = R_parallel + R_series = 2 Ω + 4 Ω = 6 Ω
            { id: "b", text: "9 Ω" }, 
            { id: "c", text: "10 Ω" }, 
            { id: "d", text: "13 Ω" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP136", // Renumbered from Q134
        questionText: "A wire of resistance R is cut into three identical pieces. These three pieces are then connected in parallel with each other. What is the equivalent resistance of this parallel combination?", 
        options: [
            { id: "a", text: "R/3" }, 
            { id: "b", text: "R/6" }, 
            { id: "c", text: "R/9" }, // Each piece has resistance R/3. In parallel: 1/R_eq = 1/(R/3) + 1/(R/3) + 1/(R/3) = 3/(R/3) + 3/(R/3) + 3/(R/3) = 9/R. R_eq = R/9.
            { id: "d", text: "3R" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP137", // Renumbered from Q135
        questionText: "An electric heater rated 1000 W (1 kW) operates for an average of 2 hours per day. What is the cost of using it for 30 days if the cost of electrical energy is Rs. 8 per kWh?", 
        options: [
            { id: "a", text: "Rs. 48" }, 
            { id: "b", text: "Rs. 160" }, 
            { id: "c", text: "Rs. 480" }, // Total energy = Power * Time = 1 kW * (2 hours/day * 30 days) = 1 kW * 60 hours = 60 kWh. Cost = Energy * Rate = 60 kWh * Rs. 8/kWh = Rs. 480.
            { id: "d", text: "Rs. 600" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP138", // Renumbered from Q136
        questionText: "A light bulb is rated '60 W, 220 V'. What is its electrical resistance when operating under these conditions?", 
        options: [
            { id: "a", text: "3.67 Ω" }, 
            { id: "b", text: "807 Ω" }, // P = V²/R => R = V²/P = (220 V)² / 60 W = 48400 / 60 Ω ≈ 806.7 Ω
            { id: "c", text: "13200 Ω" }, 
            { id: "d", text: "0.27 Ω" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP139", // Renumbered from Q137
        questionText: "Consider two electric bulbs with power ratings (P₁, V) and (P₂, V) designed to operate at the same voltage V. If these two bulbs are connected in series across a supply voltage V, what will be the ratio of the actual power consumed by them (P₁'/P₂')?", 
        options: [
            { id: "a", text: "P₁ / P₂" }, 
            { id: "b", text: "P₂ / P₁" }, // R = V²/P. In series, current I is same. Actual power P' = I²R. P₁'/P₂' = (I²R₁)/(I²R₂) = R₁/R₂ = (V²/P₁)/(V²/P₂) = P₂/P₁
            { id: "c", text: "(P₁ / P₂)²" }, 
            { id: "d", text: "(P₂ / P₁)²" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP140", // Renumbered from Q138
        questionText: "An ideal transformer has 200 turns in the primary coil and 1000 turns in the secondary coil. If the primary coil draws a current of 10 A, what is the current flowing in the secondary coil?", 
        options: [
            { id: "a", text: "2 A" }, // For ideal transformer, VpIp = VsIs. Also Vs/Vp = Ns/Np. Is = Ip * (Vp/Vs) = Ip * (Np/Ns) = 10 A * (200/1000) = 10 A * (1/5) = 2 A
            { id: "b", text: "10 A" }, 
            { id: "c", text: "50 A" }, 
            { id: "d", text: "0.5 A" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP141", // Renumbered from Q139
        questionText: "The acceleration due to gravity on Planet X (gₓ) is half that on Earth (g<0xE2><0x82><0x91>), and the radius of Planet X (Rₓ) is twice that of Earth (R<0xE2><0x82><0x91>). If an object weighs 120 N on Earth (W<0xE2><0x82><0x91> = mg<0xE2><0x82><0x91>), what will it weigh on Planet X (Wₓ = mgₓ)?", 
        options: [
            { id: "a", text: "30 N" }, 
            { id: "b", text: "60 N" }, // Wₓ = m * gₓ = m * (g<0xE2><0x82><0x91>/2) = (mg<0xE2><0x82><0x91>)/2 = W<0xE2><0x82><0x91>/2 = 120 N / 2 = 60 N. The radius information is irrelevant here.
            { id: "c", text: "120 N" }, 
            { id: "d", text: "240 N" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP142", // Renumbered from Q140
        questionText: "A constant force acts on a body of mass 5 kg, initially at rest. The body moves a distance of 50 m in 5 seconds. What is the magnitude of the force?", 
        options: [
            { id: "a", text: "10 N" }, 
            { id: "b", text: "20 N" }, // s = ut + 1/2 at². 50 = 0 + 1/2 * a * (5)². 50 = 12.5 a => a = 50 / 12.5 = 4 m/s². F = ma = 5 kg * 4 m/s² = 20 N.
            { id: "c", text: "40 N" }, 
            { id: "d", text: "50 N" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP143", // Renumbered from Q141
        questionText: "Water rises to a certain vertical height 'h' in a capillary tube of radius 'r' due to surface tension. If the same tube is tilted so that it makes an angle of 60° with the vertical, what will be the vertical height to which the water will rise in the tilted tube?", 
        options: [
            { id: "a", text: "h (The maximum possible vertical height remains the same)" }, // The length along the tube will increase (l = h/cos60 = 2h), but the vertical component h is limited by surface tension forces.
            { id: "b", text: "h/2" }, 
            { id: "c", text: "2h" }, 
            { id: "d", text: "h cos 60° (= h/2)" }
        ], 
        correctOptionId: "a" // This is the standard interpretation, vertical height limit is unchanged.
    },
    { 
        id: "KP144", // Renumbered from Q142
        questionText: "A man weighs W on the surface of the Earth (radius R). What is his weight at a height equal to the radius of the Earth (R) above the Earth's surface?", 
        options: [
            { id: "a", text: "W" }, 
            { id: "b", text: "W/2" }, 
            { id: "c", text: "W/4" }, // g' = GM/(R+h)² = GM/(R+R)² = GM/(2R)² = (1/4) * (GM/R²) = g/4. Weight = mg' = mg/4 = W/4.
            { id: "d", text: "W/9" }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP145", // Renumbered from Q143
        questionText: "A rectangular block of wood has dimensions 10cm x 20cm x 5cm. It is placed on a horizontal table. First, it rests on its largest face (20cm x 10cm), exerting pressure P₁. Then, it rests on its smallest face (10cm x 5cm), exerting pressure P₂. What is the ratio P₁ : P₂?", 
        options: [
            { id: "a", text: "1 : 4" }, // Area₁ = 200 cm². Area₂ = 50 cm². Pressure = Force/Area = Weight/Area. P₁/P₂ = (W/A₁)/(W/A₂) = A₂/A₁ = 50/200 = 1/4.
            { id: "b", text: "4 : 1" }, 
            { id: "c", text: "1 : 2" }, 
            { id: "d", text: "2 : 1" }
        ], 
        correctOptionId: "a" 
    },
    // Skipping original Q144 as it was missing
    { 
        id: "KP146", // Renumbered from Q145
        questionText: "A constant force F acting on an object causes a displacement d and does work W. If the force is doubled (to 2F) and the displacement is halved (to d/2), what is the new work done (W')?", 
        options: [
            { id: "a", text: "W/2" }, 
            { id: "b", text: "W" }, // W' = (2F) * (d/2) = F * d = W
            { id: "c", text: "2W" }, 
            { id: "d", text: "4W" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP147", // Renumbered from Q146
        questionText: "A convex lens of focal length 10 cm forms a real, inverted image that is double the size of the object. What is the object distance (u)?", 
        options: [
            { id: "a", text: "-15 cm" }, // Magnification m = v/u = -2 (real, inverted). So v = -2u. Lens formula: 1/v - 1/u = 1/f. 1/(-2u) - 1/u = 1/10. (-1 - 2)/(2u) = 1/10. -3/(2u) = 1/10. 2u = -30. u = -15 cm.
            { id: "b", text: "-20 cm" }, 
            { id: "c", text: "-30 cm" }, 
            { id: "d", text: "-5 cm" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP148", // Renumbered from Q147
        questionText: "A steady current of 0.5 Amperes flows through a resistor for 2 minutes. Approximately how many electrons pass through the resistor during this time? (Charge of one electron e ≈ 1.6 x 10⁻¹⁹ C)", 
        options: [
            { id: "a", text: "3.75 x 10²⁰" }, // Total Charge Q = I * t = 0.5 A * (2 * 60 s) = 0.5 * 120 C = 60 C. Number of electrons N = Q / e = 60 C / (1.6 x 10⁻¹⁹ C) = (60 / 1.6) * 10¹⁹ = 37.5 * 10¹⁹ = 3.75 x 10²⁰.
            { id: "b", text: "6.0 x 10¹⁹" }, 
            { id: "c", text: "1.875 x 10²⁰" }, 
            { id: "d", text: "60 x 10¹⁸" }
        ], 
        correctOptionId: "a" 
    },
    { 
        id: "KP149", // Renumbered from Q148
        questionText: "A motor pump consumes 4 kW (4000 W) of electrical power to lift water. If its efficiency is 75%, approximately how much mass of water can it lift per minute (60 seconds) to a height of 10 m? (Take g = 10 m/s²)", 
        options: [
            { id: "a", text: "1200 kg" }, 
            { id: "b", text: "1800 kg" }, // Useful Power Output = Efficiency * Input Power = 0.75 * 4000 W = 3000 W. Output Power = Work / Time = (mgh) / t. 3000 W = (m * 10 m/s² * 10 m) / 60 s. 3000 = (100m) / 60. 180000 = 100m. m = 1800 kg.
            { id: "c", text: "2400 kg" }, 
            { id: "d", text: "3000 kg" }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP150", // Renumbered from Q149
        questionText: "When a bus, initially at rest, suddenly starts moving forward, passengers tend to lurch backward. This phenomenon is best explained by:", 
        options: [
            { id: "a", text: "The forward force exerted by the bus engine on the passengers." }, 
            { id: "b", text: "The inertia of rest of the passengers' bodies (especially the upper part)." }, 
            { id: "c", text: "A sudden backward acceleration applied to the bus." }, 
            { id: "d", text: "Increased air resistance pushing the passengers back." }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP151", // Renumbered from Q150
        questionText: "A sharp knife cuts vegetables more easily than a blunt knife because:", 
        options: [
            { id: "a", text: "The sharp knife allows the user to apply significantly more force." }, 
            { id: "b", text: "The sharp knife experiences less friction with the vegetable." }, 
            { id: "c", text: "The very small area of the sharp edge exerts a much greater pressure for the same applied force." }, 
            { id: "d", text: "The material of the sharp knife is inherently harder." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP152", // Renumbered from Q151
        questionText: "The base of a large dam wall is constructed to be much thicker than its top section primarily to:", 
        options: [
            { id: "a", text: "Properly support the weight of the concrete/structure above it." }, 
            { id: "b", text: "Withstand the significantly greater hydrostatic pressure exerted by the water at greater depths." }, 
            { id: "c", text: "Prevent erosion caused by water flowing near the base." }, 
            { id: "d", text: "Improve stability against potential earthquakes." }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP153", // Renumbered from Q152
        questionText: "Astronauts inside an orbiting space station, like the ISS, experience a sensation of weightlessness because:", 
        options: [
            { id: "a", text: "They are so far from Earth that Earth's gravitational pull is negligible." }, 
            { id: "b", text: "The rapid rotation of the space station effectively cancels out Earth's gravity." }, 
            { id: "c", text: "Both the astronauts and the space station are continuously falling towards Earth (orbiting) under gravity, experiencing free fall." }, 
            { id: "d", text: "The atmospheric pressure inside the station is maintained at zero." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP154", // Renumbered from Q153
        questionText: "Food generally cooks faster in a pressure cooker compared to an open pot because the increased pressure inside the cooker:", 
        options: [
            { id: "a", text: "Increases the specific heat capacity of the water significantly." }, 
            { id: "b", text: "Lowers the boiling point of the water, making steam form quicker." }, 
            { id: "c", text: "Raises the boiling point of water, allowing the food to be cooked by steam at a temperature higher than 100°C." }, 
            { id: "d", text: "Increases the thermal conductivity of the food items." }
        ], 
        correctOptionId: "c" 
    },
    // Skipping original Q155 as it was missing
    { 
        id: "KP155", // Renumbered from Q154 (Original Q155 was missing)
        questionText: "On a cold winter day, why does a metal park bench feel much colder to touch than a wooden bench placed right beside it, even if both have been outside long enough to reach the same air temperature?", 
        options: [
            { id: "a", text: "The metal bench actually has a significantly lower temperature than the wooden bench." }, 
            { id: "b", text: "Metal has a much higher specific heat capacity, so it feels colder." }, 
            { id: "c", text: "Metal is a much better thermal conductor, so it draws heat away from your hand much faster than wood does." }, 
            { id: "d", text: "Wood effectively traps more cold air within its structure." }
        ], 
        correctOptionId: "c" 
    },
     { 
        id: "KP156", // Renumbered from Q156
        questionText: "Ponds and lakes typically begin to freeze from the top surface downwards. This phenomenon is primarily due to:", 
        options: [
            { id: "a", text: "Heat radiating away into the atmosphere only from the top surface." }, 
            { id: "b", text: "The anomalous expansion of water: water is densest at 4°C, so colder water (below 4°C) rises to the top and freezes first." }, 
            { id: "c", text: "Ice itself being significantly less dense than liquid water." }, 
            { id: "d", text: "Convection currents in the water stopping completely once the surface reaches 0°C." }
        ], 
        correctOptionId: "b" // Combination of density max at 4C and ice being less dense leads to top freezing. Anomalous expansion is the key driver.
    },
    { 
        id: "KP157", // Renumbered from Q157
        questionText: "The clear daytime sky appears blue because:", 
        options: [
            { id: "a", text: "Air molecules selectively absorb blue light more strongly than other visible colors." }, 
            { id: "b", text: "The atmosphere preferentially reflects blue light back towards the Earth." }, 
            { id: "c", text: "Air molecules scatter shorter wavelengths of sunlight (blue and violet) much more effectively than longer wavelengths (red and orange) - known as Rayleigh scattering." }, 
            { id: "d", text: "Nitrogen and oxygen molecules emit blue light when excited by incoming sunlight." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP158", // Renumbered from Q158
        questionText: "A pencil or straw partly immersed in a glass of water appears bent or broken at the water surface when viewed from the side. This optical effect is due to:", 
        options: [
            { id: "a", text: "Reflection of light from the water surface." }, 
            { id: "b", text: "Dispersion of white light into different colors by the water." }, 
            { id: "c", text: "Absorption of certain wavelengths of light by the water." }, 
            { id: "d", text: "Refraction of light rays as they pass from the denser medium (water) to the rarer medium (air) before reaching the observer's eye." }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP159", // Renumbered from Q159
        questionText: "If you put your ear close to a railway track, you can often hear an approaching train much earlier than you can hear it through the air. This is because:", 
        options: [
            { id: "a", text: "The intensity (loudness) of sound is inherently greater in solids." }, 
            { id: "b", text: "The frequency of the sound waves is significantly higher when traveling through the metal rails." }, 
            { id: "c", text: "Sound travels much faster through solids (like the steel rails) than it does through gases (like air)." }, 
            { id: "d", text: "Air dampens or attenuates sound waves much more significantly over distance than solids do." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP160", // Renumbered from Q160
        questionText: "The conical shape of a traditional megaphone helps to make a person's voice sound louder in a specific direction primarily by:", 
        options: [
            { id: "a", text: "Increasing the frequency of the sound waves produced." }, 
            { id: "b", text: "Decreasing the wavelength of the sound waves." }, 
            { id: "c", text: "Preventing the sound waves from spreading out in all directions, concentrating them forward through multiple reflections off the inner surface." }, 
            { id: "d", text: "Filtering out background noise more effectively." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP161", // Renumbered from Q161
        questionText: "Birds can often perch safely on a single high-voltage power line without being electrocuted because:", 
        options: [
            { id: "a", text: "Their feathers provide exceptionally high electrical insulation." }, 
            { id: "b", text: "By touching only one wire, there is no significant potential difference (voltage drop) across their body to drive a dangerous current through them." }, 
            { id: "c", text: "The voltage in power lines is so high that it doesn't affect biological organisms." }, 
            { id: "d", text: "High-voltage power lines primarily carry Alternating Current (AC), which is less dangerous than Direct Current (DC)." }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP162", // Renumbered from Q162
        questionText: "An electrical fuse wire is always connected in series with the appliance it is designed to protect because:", 
        options: [
            { id: "a", text: "This connection reduces the total resistance of the circuit." }, 
            { id: "b", text: "The entire circuit current must pass through the fuse, allowing it to melt and break the circuit if the current exceeds a safe level." }, 
            { id: "c", text: "The voltage drop across the fuse remains constant only in a series connection." }, 
            { id: "d", text: "Connecting in series requires less wiring compared to a parallel connection." }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP163", // Renumbered from Q163
        questionText: "If you rub a balloon vigorously on your hair and then place it near a wall, the balloon often sticks to the wall. This is due to:", 
        options: [
            { id: "a", text: "Magnetic forces induced by the rubbing action." }, 
            { id: "b", text: "A temporary increase in gravitational attraction." }, 
            { id: "c", text: "Adhesive substances transferred from the hair to the balloon." }, 
            { id: "d", text: "Static electricity: the charged balloon induces an opposite charge on the wall's surface, leading to electrostatic attraction." }
        ], 
        correctOptionId: "d" 
    },
    { 
        id: "KP164", // Renumbered from Q164
        questionText: "A large ship made mostly of iron floats in water, whereas a small solid iron nail sinks. This happens because:", 
        options: [
            { id: "a", text: "The ship contains a large amount of trapped air, making its overall average density less than the nail." }, 
            { id: "b", text: "The ship's carefully designed hollow shape displaces a very large volume of water, generating a buoyant force greater than its total weight (Archimedes' Principle)." }, 
            { id: "c", text: "The water pressure acting on the large surface area of the ship is much higher." }, 
            { id: "d", text: "The iron nail experiences a greater effect from the water's surface tension." }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP165", // Renumbered from Q165
        questionText: "Handles of cooking pots and pans are often made of materials like plastic or wood because these materials are:", 
        options: [
            { id: "a", text: "Very good conductors of heat, allowing for even cooking." }, 
            { id: "b", text: "Poor conductors of heat (good thermal insulators), preventing the handle from becoming dangerously hot." }, 
            { id: "c", text: "Significantly lighter in weight than the metal pot itself." }, 
            { id: "d", text: "Generally cheaper to manufacture than using metal for the handles." }
        ], 
        correctOptionId: "b" 
    },
    // Skipping original Q166 as it was missing
    { 
        id: "KP166", // Renumbered from Q167 (Original Q166 was missing)
        questionText: "It is generally much easier to roll a heavy cylindrical object (like a barrel) across the floor than to slide it because:", 
        options: [
            { id: "a", text: "Rolling generates significantly less heat due to friction." }, 
            { id: "b", text: "Rolling friction (resistance to rolling) is typically much smaller than sliding friction (kinetic friction) between the same surfaces." }, 
            { id: "c", text: "The area of contact between the cylinder and the floor is smaller when rolling." }, 
            { id: "d", text: "The force of gravity provides more assistance to rolling motion compared to sliding motion." }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP167", // Renumbered from Q168
        questionText: "Vehicle tyres have treads (patterns of grooves and ridges) primarily to:", 
        options: [
            { id: "a", text: "Reduce the overall weight of the tyre and the vehicle." }, 
            { id: "b", text: "Make the ride smoother by absorbing small bumps." }, 
            { id: "c", text: "Increase the friction (grip) between the tyre and the road surface, especially by channeling away water in wet conditions." }, 
            { id: "d", text: "Decrease the noise produced by the tyres rolling on the road." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP168", // Renumbered from Q169
        questionText: "The Sun appears more reddish or orange during sunrise and sunset compared to midday because at these times:", 
        options: [
            { id: "a", text: "The Sun's actual temperature is lower." }, 
            { id: "b", text: "Sunlight has to travel through a much longer path in the Earth's atmosphere, causing more scattering of shorter (blue/violet) wavelengths, leaving longer (red/orange) wavelengths to reach the observer." }, 
            { id: "c", text: "Red light travels significantly faster through the atmosphere than blue light." }, 
            { id: "d", text: "Atmospheric dust particles preferentially absorb blue and green light." }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP169", // Renumbered from Q170
        questionText: "Pouring cold water over a tight metal lid on a glass jar often helps to loosen it. This works primarily because:", 
        options: [
            { id: "a", text: "The cold water acts as an effective lubricant between the lid and the jar." }, 
            { id: "b", text: "The metal lid tends to contract more (or faster) due to the cold temperature than the glass jar does, slightly reducing its diameter." }, 
            { id: "c", text: "The glass jar significantly expands when suddenly cooled by the water." }, 
            { id: "d", text: "The sudden cooling drastically decreases the air pressure inside the jar." }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP170", // Renumbered from Q171
        questionText: "A simple pendulum, once set swinging, eventually comes to rest. This is primarily due to:", 
        options: [
            { id: "a", text: "The force of gravity acting on the pendulum bob gradually decreasing over time." }, 
            { id: "b", text: "The tension in the supporting string or rod becoming zero periodically." }, 
            { id: "c", text: "Energy dissipation caused by non-conservative forces like air resistance acting on the bob and friction at the pivot point." }, 
            { id: "d", text: "A gradual decrease in the mass of the pendulum bob as it swings." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP171", // Renumbered from Q172
        questionText: "Neglecting air resistance, an object in free fall near the Earth's surface accelerates downwards at approximately 'g' (9.8 m/s²) because:", 
        options: [
            { id: "a", text: "Its velocity simply increases at a constant rate by definition." }, 
            { id: "b", text: "Air resistance provides a constant upward push balancing other forces." }, 
            { id: "c", text: "The constant downward force of Earth's gravity acting on the object's constant mass produces a constant acceleration according to Newton's Second Law (F=ma)." }, 
            { id: "d", text: "Its potential energy is converted into kinetic energy at an accelerating rate." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP172", // Renumbered from Q173
        questionText: "After walking across a carpeted room, especially on a dry day, touching a metal doorknob sometimes results in a small electric shock. This is caused by:", 
        options: [
            { id: "a", text: "Rapid conduction of body heat into the colder metal doorknob." }, 
            { id: "b", text: "Magnetic fields generated by the friction of walking on the carpet." }, 
            { id: "c", text: "The sudden discharge of static electricity that has built up on your body due to friction with the carpet." }, 
            { id: "d", text: "A brief chemical reaction between the skin and the metal of the doorknob." }
        ], 
        correctOptionId: "c" 
    },
    { 
        id: "KP173", // Renumbered from Q174
        questionText: "A freely suspended magnetic compass needle aligns itself approximately along the North-South direction because:", 
        options: [
            { id: "a", text: "It is strongly attracted by large deposits of magnetic minerals located near the geographic North Pole." }, 
            { id: "b", text: "The Earth itself acts like a giant magnet, producing a magnetic field that exerts a torque on the compass needle, aligning it with the field lines." }, 
            { id: "c", text: "The gravitational pull from stars in the northern and southern hemispheres aligns the needle." }, 
            { id: "d", text: "Prevailing air currents flowing from North to South exert a force on the lightweight needle." }
        ], 
        correctOptionId: "b" 
    },
    { 
        id: "KP174", // Renumbered from Q175
        questionText: "Why is it considered dangerous to stand under a tall, isolated tree during a thunderstorm?", 
        options: [
            { id: "a", text: "Trees naturally attract more rain, increasing the chance of getting wet and cold." }, 
            { id: "b", text: "The tree is more likely to be blown over by the strong winds associated with the storm." }, 
            { id: "c", text: "Being tall and somewhat conductive (especially when wet), the tree provides a preferential path for a lightning strike to reach the ground." }, 
            { id: "d", text: "The sound of thunder is significantly amplified under the canopy of a tree, potentially causing hearing damage." }
        ], 
        correctOptionId: "c" 
    }

    ],
    "Chemistry": [
        // 12 Chemistry Questions (Sample - reuse/modify or add new)
        { id: "KC001", questionText: "Which gas is commonly used in fire extinguishers?", options: [{ id: "a", text: "Oxygen" }, { id: "b", text: "Nitrogen" }, { id: "c", text: "Carbon Dioxide" }, { id: "d", text: "Hydrogen" }], correctOptionId: "c" },
        { id: "KC002", questionText: "What is the main component of vinegar?", options: [{ id: "a", text: "Citric Acid" }, { id: "b", text: "Acetic Acid" }, { id: "c", text: "Sulfuric Acid" }, { id: "d", text: "Hydrochloric Acid" }], correctOptionId: "b" },
        { id: "KC003", questionText: "What is the chemical formula for Ozone?", options: [{ id: "a", text: "O" }, { id: "b", text: "O2" }, { id: "c", text: "O3" }, { id: "d", text: "O4" }], correctOptionId: "c" },
        { id: "KC004", questionText: "Graphite and Diamond are allotropes of which element?", options: [{ id: "a", text: "Silicon" }, { id: "b", text: "Carbon" }, { id: "c", text: "Sulfur" }, { id: "d", text: "Phosphorus" }], correctOptionId: "b" },
        // Add 8 more Chemistry questions...
        { id: "KC005", questionText: "Placeholder Chem Q5?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "a" },
        { id: "KC006", questionText: "Placeholder Chem Q6?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "b" },
        { id: "KC007", questionText: "Placeholder Chem Q7?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "c" },
        { id: "KC008", questionText: "Placeholder Chem Q8?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "d" },
        { id: "KC009", questionText: "Placeholder Chem Q9?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "a" },
        { id: "KC010", questionText: "Placeholder Chem Q10?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "b" },
        { id: "KC011", questionText: "Placeholder Chem Q11?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "c" },
        { id: "KC012", questionText: "Placeholder Chem Q12?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "d" }
    ],
    "Biology": [
        // 12 Biology Questions (Sample - reuse/modify or add new)
        { id: "KB001", questionText: "Which blood type is the universal donor?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "AB" }, { id: "d", text: "O Negative" }], correctOptionId: "d" },
        { id: "KB002", questionText: "What part of the brain controls balance and coordination?", options: [{ id: "a", text: "Cerebrum" }, { id: "b", text: "Cerebellum" }, { id: "c", text: "Medulla Oblongata" }, { id: "d", text: "Hypothalamus" }], correctOptionId: "b" },
        { id: "KB003", questionText: "What is the function of the kidneys?", options: [{ id: "a", text: "Pump blood" }, { id: "b", text: "Digest food" }, { id: "c", text: "Filter waste from blood" }, { id: "d", text: "Produce hormones" }], correctOptionId: "c" },
        { id: "KB004", questionText: "Where does fertilization typically occur in humans?", options: [{ id: "a", text: "Ovary" }, { id: "b", text: "Uterus" }, { id: "c", text: "Fallopian Tube" }, { id: "d", text: "Vagina" }], correctOptionId: "c" },
        // Add 8 more Biology questions...
        { id: "KB005", questionText: "Placeholder Bio Q5?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "a" },
        { id: "KB006", questionText: "Placeholder Bio Q6?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "b" },
        { id: "KB007", questionText: "Placeholder Bio Q7?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "c" },
        { id: "KB008", questionText: "Placeholder Bio Q8?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "d" },
        { id: "KB009", questionText: "Placeholder Bio Q9?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "a" },
        { id: "KB010", questionText: "Placeholder Bio Q10?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "b" },
        { id: "KB011", questionText: "Placeholder Bio Q11?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "c" },
        { id: "KB012", questionText: "Placeholder Bio Q12?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "d" }
    ],
    "Math": [
        // 12 Math Questions (Sample - reuse/modify or add new)
        { id: "KM001", questionText: "What is the value of sin²θ + cos²θ?", options: [{ id: "a", text: "0" }, { id: "b", text: "1" }, { id: "c", text: "2" }, { id: "d", text: "tan²θ" }], correctOptionId: "b" },
        { id: "KM002", questionText: "If log₃(x) = 2, what is x?", options: [{ id: "a", text: "6" }, { id: "b", text: "8" }, { id: "c", text: "9" }, { id: "d", text: "27" }], correctOptionId: "c" },
        { id: "KM003", questionText: "What is the slope of the line y = -3x + 5?", options: [{ id: "a", text: "5" }, { id: "b", text: "3" }, { id: "c", text: "-3" }, { id: "d", text: "-3/5" }], correctOptionId: "c" },
        { id: "KM004", questionText: "What is the area of an equilateral triangle with side length 'a'?", options: [{ id: "a", text: "(√3/4)a²" }, { id: "b", text: "(1/2)a²" }, { id: "c", text: "a²" }, { id: "d", text: "(√3/2)a²" }], correctOptionId: "a" },
        // Add 8 more Math questions...
        { id: "KM005", questionText: "Placeholder Math Q5?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "a" },
        { id: "KM006", questionText: "Placeholder Math Q6?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "b" },
        { id: "KM007", questionText: "Placeholder Math Q7?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "c" },
        { id: "KM008", questionText: "Placeholder Math Q8?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "d" },
        { id: "KM009", questionText: "Placeholder Math Q9?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "a" },
        { id: "KM010", questionText: "Placeholder Math Q10?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "b" },
        { id: "KM011", questionText: "Placeholder Math Q11?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "c" },
        { id: "KM012", questionText: "Placeholder Math Q12?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "d" }
    ],
    "English": [
        // 12 English Questions (Sample - reuse/modify or add new)
        { id: "KE001", questionText: "Choose the word with the opposite meaning of 'ancient'.", options: [{ id: "a", text: "Old" }, { id: "b", text: "Modern" }, { id: "c", text: "Past" }, { id: "d", text: "Historic" }], correctOptionId: "b" },
        { id: "KE002", questionText: "Which is the correct spelling?", options: [{ id: "a", text: "Separate" }, { id: "b", text: "Seperate" }, { id: "c", text: "Saperate" }, { id: "d", text: "Sepparate" }], correctOptionId: "a" },
        { id: "KE003", questionText: "Identify the type of sentence: 'Stop!'", options: [{ id: "a", text: "Declarative" }, { id: "b", text: "Interrogative" }, { id: "c", text: "Imperative" }, { id: "d", text: "Exclamatory" }], correctOptionId: "c" }, // Could also be exclamatory depending on context
        { id: "KE004", questionText: "What is a group of lions called?", options: [{ id: "a", text: "Herd" }, { id: "b", text: "Pack" }, { id: "c", text: "Pride" }, { id: "d", text: "Flock" }], correctOptionId: "c" },
        // Add 8 more English questions...
        { id: "KE005", questionText: "Placeholder Eng Q5?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "a" },
        { id: "KE006", questionText: "Placeholder Eng Q6?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "b" },
        { id: "KE007", questionText: "Placeholder Eng Q7?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "c" },
        { id: "KE008", questionText: "Placeholder Eng Q8?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "d" },
        { id: "KE009", questionText: "Placeholder Eng Q9?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "a" },
        { id: "KE010", questionText: "Placeholder Eng Q10?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "b" },
        { id: "KE011", questionText: "Placeholder Eng Q11?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "c" },
        { id: "KE012", questionText: "Placeholder Eng Q12?", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }, { id: "c", text: "C" }, { id: "d", text: "D" }], correctOptionId: "d" }
    ],
    "GK": [
        // 12 GK Questions (Sample)
        { id: "KG001", questionText: "What is the currency of Japan?", options: [{ id: "a", text: "Won" }, { id: "b", text: "Yuan" }, { id: "c", text: "Yen" }, { id: "d", text: "Dollar" }], correctOptionId: "c" },
        { id: "KG002", questionText: "Which planet is closest to the Sun?", options: [{ id: "a", text: "Venus" }, { id: "b", text: "Earth" }, { id: "c", text: "Mars" }, { id: "d", text: "Mercury" }], correctOptionId: "d" },
        { id: "KG003", questionText: "Who painted the Mona Lisa?", options: [{ id: "a", text: "Michelangelo" }, { id: "b", text: "Raphael" }, { id: "c", text: "Leonardo da Vinci" }, { id: "d", text: "Donatello" }], correctOptionId: "c" },
        { id: "KG004", questionText: "What is the highest mountain peak in the world?", options: [{ id: "a", text: "K2" }, { id: "b", text: "Kangchenjunga" }, { id: "c", text: "Mount Everest" }, { id: "d", text: "Makalu" }], correctOptionId: "c" },
        { id: "KG005", questionText: "Which country is known as the Land of the Rising Sun?", options: [{ id: "a", text: "China" }, { id: "b", text: "South Korea" }, { id: "c", text: "Japan" }, { id: "d", text: "Thailand" }], correctOptionId: "c" },
        { id: "KG006", questionText: "What is the capital of Australia?", options: [{ id: "a", text: "Sydney" }, { id: "b", text: "Melbourne" }, { id: "c", text: "Brisbane" }, { id: "d", text: "Canberra" }], correctOptionId: "d" },
        { id: "KG007", questionText: "Who wrote 'Hamlet'?", options: [{ id: "a", text: "Charles Dickens" }, { id: "b", text: "William Shakespeare" }, { id: "c", text: "Jane Austen" }, { id: "d", text: "Leo Tolstoy" }], correctOptionId: "b" },
        { id: "KG008", questionText: "What is the largest desert in the world?", options: [{ id: "a", text: "Sahara Desert" }, { id: "b", text: "Arabian Desert" }, { id: "c", text: "Gobi Desert" }, { id: "d", text: "Antarctic Desert" }], correctOptionId: "d" }, // Antarctic is largest polar desert
        { id: "KG009", questionText: "Which gas makes up most of the Earth's atmosphere?", options: [{ id: "a", text: "Oxygen" }, { id: "b", text: "Nitrogen" }, { id: "c", text: "Carbon Dioxide" }, { id: "d", text: "Argon" }], correctOptionId: "b" },
        { id: "KG010", questionText: "In which continent is the Nile River primarily located?", options: [{ id: "a", text: "Asia" }, { id: "b", text: "South America" }, { id: "c", text: "Africa" }, { id: "d", text: "Europe" }], correctOptionId: "c" },
        { id: "KG011", questionText: "What is the standard unit of length in the metric system?", options: [{ id: "a", text: "Foot" }, { id: "b", text: "Inch" }, { id: "c", text: "Meter" }, { id: "d", text: "Yard" }], correctOptionId: "c" },
        { id: "KG012", questionText: "Which festival is known as the Festival of Lights in Hinduism?", options: [{ id: "a", text: "Holi" }, { id: "b", text: "Diwali (Tihar)" }, { id: "c", text: "Dashain" }, { id: "d", text: "Navratri" }], correctOptionId: "b" }
    ]
};
