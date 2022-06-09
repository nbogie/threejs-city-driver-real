Three.js city driver using Three.js and Typescript bundled with parcel 🚀🔥.

Uses [this Three.js, TypeScript, Parcel starter code](https://github.com/nbogie/threejs-ts-starter) which was originally modified from from [Alberto Adrián Pucheta's repo](https://github.com/adrianrey05/parcel-typescript-threejs).

## Install

```
yarn
```

## Run

in dev mode:

```
yarn run start
```

then open [http://localhost:1234](http://localhost:1234) in your browser.

## Build

```
yarn run build
```

# Change log

### 08 / 06 / 2022 done

- convert to TypeScript
- switch to use three.js's mathutils (randFloat, randFloatSpread)

### 11 / 12 / 2020 done

- added another camera mode to track flying sheep. harsh.
- tidied camera stuff into camera tab

### 5 / 12/ 2020 done

- mouse down and up event handling ONLY prepares a mouse object
- car can be braked with right mouse button:
- car pitches forward when braking
- smoke particles when braking (from front wheels)
- all particles rotate, increase in size, drift forward (-z)
- smoke particles have randomness to lifespan
- moved updateCar out to vehicle tab

### older done

- added rainbow trails for the sheep
- added car pitching by acceleration
- made accel not quite instant
- added a lookAt for the sinusoidal
- centre grid helper on car, and have it toggled with 'd' along with axes helper
- implemented respotting pedestrian for pedestrian cam.
- change "boring" chase cam so that it stays closer to the centre of the road.

- add a huge ground plane
- add sky
- add stripes to the road
- add car move from side to side with mouse
- add car acceleration with mouse pressed
- add auto braking
- make wheels spin
- make car tilt when moving
- sine wave to change ambient light intensity
- add particle trails from the back wheels
- make buildings grow
- add key press to toggle camera views (press 'c')

# TODO list

- TODO add mouse controlled orbit camera
- TODO make buildings height change by audio volume
- TODO add pedestrians, stationary cars
- TODO add street lights, headlights
- TODO add stars during the night
- TODO add countdown timers
- TODO add text over the road (score, distance, speedometer,
- timer, sheeps hit, game over)
- TODO don't roll at slow velocities
- TODO have buildings scale down to 0 behind the car
