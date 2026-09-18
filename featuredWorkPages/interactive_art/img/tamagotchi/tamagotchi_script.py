import board
import busio
import displayio
import digitalio
import time

import analogio
import pwmio
import random

import adafruit_dht

from i2cdisplaybus import I2CDisplayBus

import terminalio
from adafruit_display_text import label
import adafruit_displayio_ssd1306
#import adafruit_imageload


light_sensor = analogio.AnalogIn(board.GP26)
pressure_sensor = analogio.AnalogIn(board.GP27)
dhtDevice = adafruit_dht.DHT22(board.GP5)


prev_input = 0

GAIN = 1

displayio.release_displays()

i2c = busio.I2C(board.GP1, board.GP0)
display_bus = I2CDisplayBus(i2c, device_address=0x3C)
display = adafruit_displayio_ssd1306.SSD1306(display_bus, width=128, height=64)
#load = adafruit_imageload


def read_pbm(egg):
    with open("/egg.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height
    #image_data, width, height = read_pbm("/egg.pbm")
def read_pbm(snow):
    with open("/creature_snow.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height
    #image_data, width, height = read_pbm("/creature_snow.pbm")
def read_pbm(ice):
    with open("/creature_ice.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height 
    #image_data, width, height = read_pbm("/creature_ice.pbm")
def read_pbm(water):
    with open("/creature_water.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height 
    #image_data, width, height = read_pbm("/creature_water.pbm")
def read_pbm(wave):
    with open("/creature_wave.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height 
    #image_data, width, height = read_pbm("/creature_wave.pbm")
def read_pbm(fire):
    with open("/creature_fire.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height 
    #image_data, width, height = read_pbm("/creature_fire.pbm")
def read_pbm(lava):
    with open("/creature_lava.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height 
    #image_data, width, height = read_pbm("/creature_lava.pbm")
def read_pbm(plant):
    with open("/creature_plant.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height 
    #image_data, width, height = read_pbm("/creature_plant.pbm")
def read_pbm(rock):
    with open("/creature_rock.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height 
    #image_data, width, height = read_pbm("/creature_rock.pbm")
def read_pbm(ghost):
    with open("/creature_ghost.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height 
    #image_data, width, height = read_pbm("/creature_ghost.pbm")
def read_pbm(electric):
    with open("/creature_electric.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height 
    #image_data, width, height = read_pbm("/creature_electric.pbm")
def read_pbm(storm):
    with open("/creature_storm.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height 
    #image_data, width, height = read_pbm("/creature_storm.pbm")
def read_pbm(wind):
    with open("/creature_wind.pbm", 'rb') as f:
        header = f.readline()
        assert header == b'P4\n'
        dimensions = f.readline()
        width, height = [int(i) for i in dimensions.split()]
        image_data = bytearray(f.read())
        return image_data, width, height 
    #image_data, width, height = read_pbm("/creature_wind.pbm")




# Create a bitmap the size of the display, initialized to 0 (black)
bitmap = displayio.Bitmap(128, 64, 2)

# Create a two color palette
palette = displayio.Palette(2)
palette[0] = 0x000000  # Black
palette[1] = 0xFFFFFF  # White

# Copy the image data into the display bitmap
for y in range(64):
    for x in range(128):
        byte_index = x // 8 + y * (128 // 8)
        bit_index = x % 8
        pixel = (image_data[byte_index] >> (7 - bit_index)) & 1
        bitmap[x, y] = pixel

# Create a TileGrid to hold the bitmap
tile_grid = displayio.TileGrid(bitmap, pixel_shader=palette)

# Create a Group to hold the TileGrid
group = displayio.Group()

# Add the TileGrid to the Group
group.append(tile_grid)

# Add the Group to the Display
#display.show(group)
#splash = displayio.Group()
display.root_group = group
# Keep the display on

time.sleep(1000) #idk about these numbers. do i need them?


# Keep the display on
#def main_screen(): image_data, width, height = read_pbm(egg)

#main_screen()

while True:
    if pressure_sensor.value > 2000:  
        if input(light_sensor.value) >= 5000: #bright
            if temperature_c >= 28.0: #warm
                if humidity >= 50.0:
                    image_data, width, height = read_pbm("/creature_electric.pbm")
                    time.sleep(1000)
                    # +vibration?
                    # +pressuresensor value
                    if pressure_sensor.value > 2000:
                        #main_screen()
                elif humidity < 50.0:
                    image_data, width, height = read_pbm("/creature_fire.pbm")
                    time.sleep(1000)
                    # +vibration
                    if pressure_sensor.value > 2000:
                        #main_screen()
            elif 23.0 <= temperature_c < 28.0: #medium
                if humidity >= 50.0:
                    image_data, width, height = read_pbm("/creature_plant.pbm")
                    time.sleep(1000)
                    # +vibration
                    if pressure_sensor.value > 2000:
                        #main_screen()
                elif humidity < 50.0:
                    image_data, width, height = read_pbm("/creature_wind.pbm")
                    time.sleep(1000)
                    # +vibration
                    if pressure_sensor.value > 2000:
                        #main_screen()
            elif temperature_c < 23.0: #cold
                if humidity >= 50.0:
                    image_data, width, height = read_pbm("/creature_water.pbm")
                    time.sleep(1000)
                    # +vibration
                    if pressure_sensor.value > 2000:
                        #main_screen()
                elif humidity < 50.0:
                    image_data, width, height = read_pbm("/creature_snow.pbm")
                    time.sleep(1000)
                    # +vibration
                    if pressure_sensor.value > 2000:
                        #main_screen()
        elif input(light_sensor.value) < 5000: #dark
            if temperature_c >= 28.0: #warm
                if humidity >= 50.0:
                    image_data, width, height = read_pbm("/creature_lava.pbm")
                    time.sleep(1000)
                    # +vibration
                    if pressure_sensor.value > 2000:
                        #main_screen()
                elif humidity < 50.0:
                    image_data, width, height = read_pbm("/creature_ghost.pbm")
                    time.sleep(1000)
                    # +vibration
                    if pressure_sensor.value > 2000:
                        #main_screen()
            elif 23.0 <= temperature_c < 28.0: #medium
                if humidity >= 50.0:
                    image_data, width, height = read_pbm("/creature_storm.pbm")
                    time.sleep(1000)
                    # +vibration
                    if pressure_sensor.value > 2000:
                        #main_screen()
                elif humidity < 50.0:
                    image_data, width, height = read_pbm("/creature_rock.pbm")
                    time.sleep(1000)
                    # +vibration
                    if pressure_sensor.value > 2000:
                        #main_screen()
            elif temperature_c < 23.0: #cold
                if humidity >= 50.0:
                    image_data, width, height = read_pbm("/creature_wave.pbm")
                    time.sleep(1000)
                    # +vibration
                    if pressure_sensor.value > 2000:
                        #main_screen()
                elif humidity < 50.0:
                    image_data, width, height = read_pbm("/creature_ice.pbm")
                    time.sleep(1000)
                    # +vibration
                    if pressure_sensor.value > 2000:
                        #main_screen()
    else  
        if input(light_sensor.value) >= 5000: #bright
            image_data, width, height = read_pbm("/creature_angel.pbm")
            time.sleep(1000)
            # +vibration
            if pressure_sensor.value > 1000:
                #main_screen()
        elif input(light_sensor.value) < 5000: #dark
            image_data, width, height = read_pbm("/creature_devil.pbm")
            time.sleep(1000)
            # +vibration
            if pressure_sensor.value > 1000:
                #main_screen()   
             

image_data, width, height = read_pbm("/egg.pbm")
image_data, width, height = read_pbm("/creature_ice.pbm")
image_data, width, height = read_pbm("/creature_snow.pbm")
image_data, width, height = read_pbm("/creature_water.pbm")
image_data, width, height = read_pbm("/creature_wave.pbm")
image_data, width, height = read_pbm("/creature_fire.pbm")
image_data, width, height = read_pbm("/creature_lava.pbm")
image_data, width, height = read_pbm("/creature_plant.pbm")
image_data, width, height = read_pbm("/creature_rock.pbm")
image_data, width, height = read_pbm("/creature_ghost.pbm")
image_data, width, height = read_pbm("/creature_electric.pbm")
image_data, width, height = read_pbm("/creature_storm.pbm")
image_data, width, height = read_pbm("/creature_wind.pbm")
image_data, width, height = read_pbm("/creature_angel.pbm")
image_data, width, height = read_pbm("/creature_devil.pbm")
#천악 이스터에그의 경우.

    # elif pressure_sensor.value: less than <?:
    #     print($death screen & play again?)
    #     break
    #     if $press button
    #     return $main screen

#should I use def for other sensors?


