function IRData () {
    if (picobricks.wasIrDataReceived()) {
        picobricks.oledclear()
        picobricks.showString(
        0,
        0,
        "Soil Humidity Set =",
        1
        )
        picobricks.showString(
        0,
        1,
        picobricks.selectIrButton(),
        1
        )
        basic.pause(1000)
    }
}
picobricks.onIrButton(PicoBricksIrButtonList.Ok, PicoBricksIrButtonAction.Pressed, function () {
    manuelWatering = 1
    picobricks.dcMotor(PicoBricksDcMotorType.Dc1, 50, PicoBricksDirectionType.Forward)
    basic.pause(5000)
    picobricks.dcMotor(PicoBricksDcMotorType.Dc1, 0, PicoBricksDirectionType.Forward)
    manuelWatering = 0
})
function HomeScreen () {
    picobricks.showString(
    0,
    3,
    "Soil:             ",
    1
    )
    picobricks.showString(
    0,
    1,
    "Temp: " + ("" + picobricks.temperature(PicoBricksTempList.Celsius)),
    1
    )
    picobricks.showString(
    0,
    2,
    "Hum: " + ("" + picobricks.humidity()),
    1
    )
    picobricks.showString(
    0,
    3,
    "Soil: %" + ("" + SoilPercent),
    1
    )
}
function LightControl () {
    if (LightThreshold > picobricks.ldrRead()) {
        picobricks.showString(
        0,
        0,
        "Good Evening!       ",
        1
        )
        isNight += 1
    } else {
        picobricks.showString(
        0,
        0,
        "Have a Nice Day",
        1
        )
        isNight = 0
    }
}
let humidityVal = 0
let isNight = 0
let SoilPercent = 0
let manuelWatering = 0
let LightThreshold = 0
LightThreshold = 300
manuelWatering = 0
picobricks.dcMotor(PicoBricksDcMotorType.Dc1, 0, PicoBricksDirectionType.Forward)
basic.pause(500)
picobricks.oledinit(60)
picobricks.shtcInit()
picobricks.connectIrReceiver(DigitalPin.P15)
basic.pause(2000)
picobricks.oledclear()
basic.forever(function () {
    HomeScreen()
    LightControl()
    SoilPercent = picobricks.soilRead(AnalogPin.P2)
    SoilPercent += Math.map(SoilPercent * 100, 58, 70, 100, 0)
    SoilPercent = Math.constrain(SoilPercent, 0, 100)
    SoilPercent = Math.round(SoilPercent)
    IRData()
    humidityVal = parseInt(picobricks.selectIrButton()) * 10
    if (isNight == 0) {
        if (SoilPercent <= humidityVal) {
            picobricks.dcMotor(PicoBricksDcMotorType.Dc1, 50, PicoBricksDirectionType.Forward)
        } else if (manuelWatering != 1) {
            picobricks.dcMotor(PicoBricksDcMotorType.Dc1, 0, PicoBricksDirectionType.Forward)
        }
    }
    basic.pause(1000)
})
