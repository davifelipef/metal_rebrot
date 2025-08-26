/*:
 * @author Casper Gaming
 * @url https://www.caspergaming.com/plugins/cgmz/vehicleinteriors/
 * @target MZ
 * @plugindesc Allows you to enter vehicle interior with button input
 * @help
 * ============================================================================
 * For terms and conditions using this plugin in your game please visit:
 * https://www.caspergaming.com/terms-of-use/
 * ============================================================================
 * Become a Patron to get access to beta/alpha plugins plus other goodies!
 * https://www.patreon.com/CasperGamingRPGM
 * ============================================================================
 * Version: 1.2.0
 * ----------------------------------------------------------------------------
 * Compatibility: Only tested with my CGMZ plugins.
 * Made for RPG Maker MZ 1.9.0
 * ----------------------------------------------------------------------------
 * Description: Allows you to enter the interior of the boat, ship, or airship
 * which is another map the player will be transferred to. It supports
 * keyboard and touch input.
 * ----------------------------------------------------------------------------
 * Documentation:
 * ---------------------------------General------------------------------------
 * The interior key is case sensitive, it is recommended to use a lowercase
 * character.
 *
 * For touch UI button, you can get a "home" icon button to use from my website
 * and add it to your button sheet:
 * https://www.caspergaming.com/resources/
 * You will need to add this icon to the right side of your existing button
 * sheet. Alternatively, you can get a ready-made button sheet from the demo.
 * ----------------------------Interior Options--------------------------------
 * To have no interior for that vehicle, set the map id to 0.
 * -----------------------------Plugin Commands--------------------------------
 * This plugin supports the following plugin commands:
 * • Exit Vehicle
 * This will cause the player to exit the vehicle interior
 * 
 * • Enter Vehicle
 * This will force the player into the vehicle interior they are currently
 * driving
 * 
 * • Change Vehicle
 * Changes the map/x/y/direction values used when entering the given vehicle
 * ------------------------------Saved Games-----------------------------------
 * This plugin is fully compatible with saved games. This means you can:
 *
 * ✓ Add this plugin to a saved game and it will work as expected
 * ✓ Change any plugin params and changes will be reflected in saved games
 * ✓ Remove the plugin with no issue to save data
 * -----------------------------Filename---------------------------------------
 * The filename for this plugin MUST remain CGMZ_VehicleInteriors.js
 * This is what it comes as when downloaded. The filename is used to load
 * parameters and execute plugin commands. If you change it, things will begin
 * behaving incorrectly and your game will probably crash. Please do not
 * rename the js file.
 * ------------------------------Latest Version--------------------------------
 * Hi all, this latest version updates the plugin to use the new map selection
 * ui added with MZ 1.9.0. This will require you to set up the map parameter
 * again as the type has changed, and it will also require you to re-do your
 * plugin commands. This change was made because going forward, this new ui
 * in the editor is much easier to use and will overall be better going
 * forward. If you are not on MZ 1.9.0 yet, you will need to enter in json
 * data in the format: {"mapId":"0","x":"0","y":"0"}.
 *
 * This update also converted the direction parameters into a selectable type,
 * so you no longer need to worry about remembering which number corresponds to
 * which direction.
 *
 * 1.2.0
 * - Map parameter converted to 1.9.0 map type
 * - Direction parameter converted to select type
 *
 * @command Enter Vehicle
 * @desc Enters the vehicle the player is currently in
 *
 * @command Exit Vehicle
 * @desc Exits the vehicle interior the player is currently inside
 *
 * @command Change Vehicle
 * @desc Changes the vehicle interior settings for a vehicle
 *
 * @arg Vehicle
 * @type select
 * @option boat
 * @option ship
 * @option airship
 * @default boat
 * @desc The vehicle to change
 *
 * @arg Map
 * @type location
 * @desc The new map and x/y coordinates within the map
 *
 * @arg Direction
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 2
 * @desc The new direction value to use
 * 
 * @param General Options
 * @param Boat Options
 * @param Ship Options
 * @param Airship Options
 *
 * @param Interior Key
 * @parent General Options
 * @default a
 * @desc Key that will trigger entering the vehicle's interior.
 *
 * @param Gamepad Button
 * @parent General Options
 * @desc Gamepad button that when pressed will attempt to enter the vehicle interior
 * @type select
 * @option A
 * @value 0
 * @option B
 * @value 1
 * @option X
 * @value 2
 * @option Y
 * @value 3
 * @option LB
 * @value 4
 * @option RB
 * @value 5
 * @option LT
 * @value 6
 * @option RT
 * @value 7
 * @option Back / Select
 * @value 8
 * @option Start
 * @value 9
 * @option Left Stick
 * @value 10
 * @option Right Stick
 * @value 11
 * @option Dpad Up
 * @value 12
 * @option Dpad Down
 * @value 13
 * @option Dpad Left
 * @value 14
 * @option Dpad Right
 * @value 15
 * @default 0
 *
 * @param Interior Button Offset
 * @parent General Options
 * @type number
 * @min 0
 * @default 11
 * @desc Vehicle Interior Button index on the button sheet
 *
 * @param Interior Button Width
 * @parent General Options
 * @type number
 * @min 1
 * @default 1
 * @desc Vehicle Interior Button width (in multiple of 48 pixels)
 *
 * @param Interior Enable Switch
 * @parent General Options
 * @type switch
 * @default 1
 * @desc Switch which enables/disables ability to enter vehicle interiors.
 *
 * @param Boat Interior Map
 * @type location
 * @parent Boat Options
 * @desc Map to transport player to when visit interior button is pressed.
 *
 * @param Boat Interior Direction
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 0
 * @parent Boat Options
 * @desc Starting direction for interior map
 *
 * @param Ship Interior Map
 * @type location
 * @parent Ship Options
 * @desc Map to transport player to when visit interior button is pressed.
 *
 * @param Ship Interior Direction
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 0
 * @parent Ship Options
 * @desc Starting direction for interior map
 *
 * @param Airship Interior Map
 * @type location
 * @parent Airship Options
 * @desc Map to transport player to when visit interior button is pressed.
 *
 * @param Airship Interior Direction
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 0
 * @parent Airship Options
 * @desc Starting direction for interior map
*/
/*:zh-CN
 * @author Casper Gaming
 * @url https://www.caspergaming.com/plugins/cgmz/vehicleinteriors/
 * @target MZ
 * @plugindesc 船舱系统（设置可以进入的载具内部空间）
 * @help
 * ============================================================================
 * 【使用条款】
 * 1、本插件可作商用或非商用。
 * 2、须注明插件作者"Casper Gaming"。
 * 3、须提供该插件的作者网站链接。
 * 4、最终使用条款以作者官网公告为准。https://www.caspergaming.com/terms-of-use/
 * ============================================================================
 * 【赞助支持】
 * 您可以登陆以下网站并对作者进行支持和赞助。
 * 然后获得作者和其插件的最新资讯，以及测试版插件的试用。
 * https://www.patreon.com/CasperGamingRPGM
 * ============================================================================
 * 【插件版本】 V 1.2.0
 * ----------------------------------------------------------------------------
 * 【兼容性】仅测试作者所制作的插件
 * 【RM版本】RPG Maker MZ 1.9.0
 * ----------------------------------------------------------------------------
 * 【插件描述】
 *  设置三种载具的内部空间（船舱），通过快捷键或点击界面图标进入。
 *  并可以通过插件命令进出或切换载具。
 * ----------------------------------------------------------------------------
 * 【使用说明】
 *
 * 一、常规设置
 * 1、需要设置开关来启用或关闭船舱系统。
 *    进入船舱的默认快捷键为a，修改快捷键需区分大小写。
 * 2、在界面进行点击进入船舱的图标，
 *    需要添加在“工程\img\system\ButtonSet.png”的右边。
 *    图标规格是 48*48 像素。设置中的默认路径是 X 11, Y 1。
 * 3、您可以在作者网站获取这个图标，
 *    https://www.caspergaming.com/resources/
 *    也可以在作者的演示工程内获取已经做好的图标文件用来替换。
 *
 * 二、插件指令
 * 本插件可以通过事件设置使用以下插件指令：
 * 1、进入船舱：进入到载具指定的内部空间。（设置地图ID指定）
 * 2、离开船舱：离开载具内部空间，回到驾驶该载具的状态和载具所在地图。
 * 3、更换载具空间：为载具重新指定一个内部空间地图。
 *
 * ----------------------------Interior Options--------------------------------
 * To have no interior for that vehicle, set the map to 0.
 * ------------------------------Latest Version--------------------------------
 * Hi all, this latest version updates the plugin to use the new map selection
 * ui added with MZ 1.9.0. This will require you to set up the map parameter
 * again as the type has changed, and it will also require you to re-do your
 * plugin commands. This change was made because going forward, this new ui
 * in the editor is much easier to use and will overall be better going
 * forward. If you are not on MZ 1.9.0 yet, you will need to enter in json
 * data in the format: {"mapId":"0","x":"0","y":"0"}.
 *
 * This update also converted the direction parameters into a selectable type,
 * so you no longer need to worry about remembering which number corresponds to
 * which direction.
 *
 * 1.2.0
 * - Map parameter converted to 1.9.0 map type
 * - Direction parameter converted to select type
 *
 * @command Enter Vehicle
 * @text 进入船舱
 * @desc 进入正在搭乘的载具的内部空间。
 *
 * @command Exit Vehicle
 * @text 离开船舱
 * @desc 离开载具内部空间，回到驾驶该载具的状态和地图。
 *
 * @command Change Vehicle
 * @text 更换载具空间
 * @desc 为载具重新指定一个内部空间地图。
 *
 * @arg Vehicle
 * @text 载具
 * @type select
 * @option boat
 * @option ship
 * @option airship
 * @default boat
 * @desc 切换到选择的载具。
 *
 * @arg Map
 * @text 地图ID
 * @type location
 * @desc The new map and x/y coordinates within the map
 *
 * @arg Direction
 * @text 朝向
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 2
 * @desc The new direction value to use
 * 
 * @param General Options
 * @text 常规设置
 * @param Boat Options
 * @text 小舟设置
 * @param Ship Options
 * @text 大船设置
 * @param Airship Options
 * @text 飞艇设置
 *
 * @param Interior Key
 * @text 快捷键
 * @parent General Options
 * @default a
 * @desc 设置一个快捷键来快速进入船舱。默认a，按键区分大小写。
 *
 * @param Gamepad Button
 * @parent General Options
 * @desc Gamepad button that when pressed will attempt to enter the vehicle interior
 * @type select
 * @option A
 * @value 0
 * @option B
 * @value 1
 * @option X
 * @value 2
 * @option Y
 * @value 3
 * @option LB
 * @value 4
 * @option RB
 * @value 5
 * @option LT
 * @value 6
 * @option RT
 * @value 7
 * @option Back / Select
 * @value 8
 * @option Start
 * @value 9
 * @option Left Stick
 * @value 10
 * @option Right Stick
 * @value 11
 * @option Dpad Up
 * @value 12
 * @option Dpad Down
 * @value 13
 * @option Dpad Left
 * @value 14
 * @option Dpad Right
 * @value 15
 * @default 0
 *
 * @param Interior Button Offset
 * @text 按键图标的位置（列）
 * @parent General Options
 * @type number
 * @min 0
 * @default 11
 * @desc 按键图标在“ButtonSet.png”中的第N列，图标规格48*48像素。默认11。须手动添加图标。
 *
 * @param Interior Button Width
 * @text 按键图标的位置（行）
 * @parent General Options
 * @type number
 * @min 1
 * @default 1
 * @desc 按键图标在“ButtonSet.png”中的第N行，图标规格48*48像素。默认1。须手动添加图标。
 *
 * @param Interior Enable Switch
 * @text 船舱系统开关
 * @parent General Options
 * @type switch
 * @default 1
 * @desc 设置一个开关ID以控制船舱系统的打开或关闭。
 *
 * @param Boat Interior Map
 * @text 内部地图
 * @type location
 * @parent Boat Options
 * @desc 指定一个地图ID作为小舟的内部空间（船舱）。
 *
 * @param Boat Interior Direction
 * @text 角色朝向
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 0
 * @parent Boat Options
 * @desc 设置角色进入后的朝向。默认2面朝下。
 *
 * @param Ship Interior Map
 * @text 内部地图
 * @type location
 * @parent Ship Options
 * @desc 指定一个地图ID作为大船的内部空间（船舱）。
 *
 * @param Ship Interior Direction
 * @text 角色朝向
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 0
 * @parent Ship Options
 * @desc 设置角色进入后的朝向。默认2面朝下。
 *
 * @param Airship Interior Map
 * @text 内部地图
 * @type location
 * @parent Airship Options
 * @desc 指定一个地图ID作为飞艇的内部空间（船舱）。
 *
 * @param Airship Interior Direction
 * @text 角色朝向
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 0
 * @parent Airship Options
 * @desc 设置角色进入后的朝向。默认2面朝下。
*/
/*:es
 * @author Casper Gaming
 * @url https://www.caspergaming.com/plugins/cgmz/vehicleinteriors/
 * @target MZ
 * @plugindesc Te permite ingresar al interior del vehículo con la entrada de botón.
 * @help
 * ============================================================================
 * Para terminos y condiciones de uso de este pluging en tu juego, por favor
 * visita:
 * https://www.caspergaming.com/terms-of-use/
 * ============================================================================
 * ¡Conviértete en un Patrocinador para obtener acceso a los plugings beta y
 * alfa, ademas de otras cosas geniales!
 * https://www.patreon.com/CasperGamingRPGM
 * ============================================================================
 * Versión: 1.2.0
 * ----------------------------------------------------------------------------
 * Compatibilidad: Sólo probado con mis CGMZ plugins.
 * Hecho para RPG Maker MZ 1.9.0
 * ----------------------------------------------------------------------------
 * Descripción: Te permite ingresar al interior del bote, nave o aeronave, 
 * que es otro mapa al que será transferido el jugador. Admite teclado y
 * entrada táctil.
 * ----------------------------------------------------------------------------
 * Documentación:
 * ---------------------------------General------------------------------------
 * La tecla interior distingue entre mayúsculas y minúsculas, se recomienda
 * utilizar un carácter en minúsculas.
 *
 * Para el botón de IU táctil, puede obtener un botón de icono de "inicio"
 * para usar desde mi sitio web  y agregarlo a su hoja de botones:
 * https://www.caspergaming.com/resources/
 * Deberá agregar este ícono al lado derecho de su hoja de botones existente. 
 * Alternativamente, puede obtener una hoja de botones lista para usar de la
 * demostración.
 * ----------------------------Interior Options--------------------------------
 * To have no interior for that vehicle, set the map to 0.
 * ---------------------------Comandos de Plugin-------------------------------
 * Este plugin admite los siguientes comandos de plugin:
 * • Salir del vehículo
 * Esto hará que el jugador salga del interior del vehículo.
 * 
 * • Entrar en el vehículo
 * Esto obligará al jugador a entrar en el interior del vehículo que están
 * conduciendo actualmente
 * 
 * • Cambiar vehículo
 * cambia los valores de mapa/x/y/dirección utilizados al ingresar el vehiculo
 * dado
 * ------------------------------Saved Games-----------------------------------
 * This plugin is fully compatible with saved games. This means you can:
 *
 * ✓ Add this plugin to a saved game and it will work as expected
 * ✓ Change any plugin params and changes will be reflected in saved games
 * ✓ Remove the plugin with no issue to save data
 * -----------------------------Filename---------------------------------------
 * The filename for this plugin MUST remain CGMZ_VehicleInteriors.js
 * This is what it comes as when downloaded. The filename is used to load
 * parameters and execute plugin commands. If you change it, things will begin
 * behaving incorrectly and your game will probably crash. Please do not
 * rename the js file.
 * ------------------------------Latest Version--------------------------------
 * Hi all, this latest version updates the plugin to use the new map selection
 * ui added with MZ 1.9.0. This will require you to set up the map parameter
 * again as the type has changed, and it will also require you to re-do your
 * plugin commands. This change was made because going forward, this new ui
 * in the editor is much easier to use and will overall be better going
 * forward. If you are not on MZ 1.9.0 yet, you will need to enter in json
 * data in the format: {"mapId":"0","x":"0","y":"0"}.
 *
 * This update also converted the direction parameters into a selectable type,
 * so you no longer need to worry about remembering which number corresponds to
 * which direction.
 *
 * 1.2.0
 * - Map parameter converted to 1.9.0 map type
 * - Direction parameter converted to select type
 *
 * @command Enter Vehicle
 * @text Entrar en el Vehículo
 * @desc Enters the vehicle the player is currently in.
 *
 * @command Exit Vehicle
 * @text Salir del Vehículo
 * @desc Exits the vehicle interior the player is currently inside.
 *
 * @command Change Vehicle
 * @text Cambiar Vehículo
 * @desc Changes the vehicle interior settings for a vehicle.
 *
 * @arg Vehicle
 * @text Vehículo
 * @type select
 * @option boat
 * @option ship
 * @option airship
 * @default boat
 * @desc El vehículo a cambiar.
 * 
 * @arg Map
 * @text Mapa
 * @type location
 * @desc The new map and x/y coordinates within the map
 *
 * @arg Direction
 * @text Dirección
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 2
 * @desc The new direction value to use
 * 
 * @param General Options
 * @text Opciones generales
 * @param Boat Options
 * @text Opciones de Bote
 * @param Ship Options
 * @text Opciones de Barco
 * @param Airship Options
 * @text Opciones de Dirigible
 *
 * @param Interior Key
 * @text Llave interior
 * @parent General Options
 * @default a
 * @desc Llave que activará el ingreso al interior del vehículo.
 *
 * @param Gamepad Button
 * @parent General Options
 * @desc Gamepad button that when pressed will attempt to enter the vehicle interior
 * @type select
 * @option A
 * @value 0
 * @option B
 * @value 1
 * @option X
 * @value 2
 * @option Y
 * @value 3
 * @option LB
 * @value 4
 * @option RB
 * @value 5
 * @option LT
 * @value 6
 * @option RT
 * @value 7
 * @option Back / Select
 * @value 8
 * @option Start
 * @value 9
 * @option Left Stick
 * @value 10
 * @option Right Stick
 * @value 11
 * @option Dpad Up
 * @value 12
 * @option Dpad Down
 * @value 13
 * @option Dpad Left
 * @value 14
 * @option Dpad Right
 * @value 15
 * @default 0
 *
 * @param Interior Button Offset
 * @text Desplazamiento del botón interior
 * @parent General Options
 * @type number
 * @min 0
 * @default 11
 * @desc Interior del vehículo Índice de botones en la hoja de botones.
 *
 * @param Interior Button Width
 * @text Ancho interior del botón
 * @parent General Options
 * @type number
 * @min 1
 * @default 1
 * @desc Ancho del botón del interior del vehículo (en múltiplos de 48 píxeles).
 *
 * @param Interior Enable Switch
 * text Interruptor de habilitación interior
 * @parent General Options
 * @type switch
 * @default 1
 * @desc Interruptor que habilita/deshabilita la capacidad de ingresar al interior del vehículo.
 *
 * @param Boat Interior Map
 * @text Mapa interior del barco
 * @type location
 * @parent Boat Options
 * @desc Mapa para transportar al jugador cuando se presiona el botón de visita interior.
 *
 * @param Boat Interior Direction
 * @text Dirección interior del bote
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 0
 * @parent Boat Options
 * @desc Dirección inicial del mapa interior.
 *
 * @param Ship Interior Map
 * @text Mapa del Interior del Barco
 * @type location
 * @parent Ship Options
 * @desc Mapa para transportar al jugador cuando se presiona el botón de visita interior.
 *
 * @param Ship Interior Direction
 * @text Dirección interior del barco
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 0
 * @parent Ship Options
 * @desc Dirección inicial del mapa interior.
 *
 * @param Airship Interior Map
 * @text Mapa interior del dirigible
 * @type location
 * @parent Airship Options
 * @desc Mapa para transportar al jugador cuando se presiona el botón de visita interior.
 *
 * @param Airship Interior Direction
 * @text Dirección interior del dirigible
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 0
 * @parent Airship Options
 * @desc Dirección inicial del mapa interior.
*/
Imported.CGMZ_VehicleInteriors = true;
CGMZ.Versions["Vehicle Interiors"] = "1.2.0";
CGMZ.VehicleInteriors = {};
CGMZ.VehicleInteriors.parameters = PluginManager.parameters('CGMZ_VehicleInteriors');
CGMZ.VehicleInteriors.InteriorKey = CGMZ.VehicleInteriors.parameters["Interior Key"];
CGMZ.VehicleInteriors.GamepadButton = Number(CGMZ.VehicleInteriors.parameters["Gamepad Button"]);
CGMZ.VehicleInteriors.BoatInteriorMapDir = Number(CGMZ.VehicleInteriors.parameters["Boat Interior Direction"]);
CGMZ.VehicleInteriors.ShipInteriorMapDir = Number(CGMZ.VehicleInteriors.parameters["Ship Interior Direction"]);
CGMZ.VehicleInteriors.AirshipInteriorMapDir = Number(CGMZ.VehicleInteriors.parameters["Airship Interior Direction"]);
CGMZ.VehicleInteriors.InteriorButtonOffset = Number(CGMZ.VehicleInteriors.parameters["Interior Button Offset"]);
CGMZ.VehicleInteriors.InteriorButtonWidth = Number(CGMZ.VehicleInteriors.parameters["Interior Button Width"]);
CGMZ.VehicleInteriors.InteriorSwitch = Number(CGMZ.VehicleInteriors.parameters["Interior Enable Switch"]);
CGMZ.VehicleInteriors.BoatInteriorMapInfo = CGMZ_Utils.parseMapParam(CGMZ.VehicleInteriors.parameters["Boat Interior Map"], "[CGMZ] Vehicle Interiors");
CGMZ.VehicleInteriors.ShipInteriorMapInfo = CGMZ_Utils.parseMapParam(CGMZ.VehicleInteriors.parameters["Ship Interior Map"],"[CGMZ] Vehicle Interiors");
CGMZ.VehicleInteriors.AirshipInteriorMapInfo = CGMZ_Utils.parseMapParam(CGMZ.VehicleInteriors.parameters["Airship Interior Map"], "[CGMZ] Vehicle Interiors");
//=============================================================================
// CGMZ_Temp
//-----------------------------------------------------------------------------
// New plugin commands for vehicles
//=============================================================================
//-----------------------------------------------------------------------------
// Register Plugin Commands
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_registerPluginCommands = CGMZ_Temp.prototype.registerPluginCommands;
CGMZ_Temp.prototype.registerPluginCommands = function() {
	alias_CGMZ_VehicleInteriors_registerPluginCommands.call(this);
	PluginManager.registerCommand("CGMZ_VehicleInteriors", "Enter Vehicle", this.pluginCommandVehicleInteriorsEnter);
	PluginManager.registerCommand("CGMZ_VehicleInteriors", "Exit Vehicle", this.pluginCommandVehicleInteriorsExit);
	PluginManager.registerCommand("CGMZ_VehicleInteriors", "Change Vehicle", this.pluginCommandVehicleInteriorsChange);
};
//-----------------------------------------------------------------------------
// Plugin Command - Enter Vehicle
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.pluginCommandVehicleInteriorsEnter = function() {
	$gamePlayer.CGMZ_forceVehicleInteriorEnter();
};
//-----------------------------------------------------------------------------
// Plugin Command - Exit Vehicle
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.pluginCommandVehicleInteriorsExit = function() {
	$gamePlayer.CGMZ_vehicleInteriorExit();
};
//-----------------------------------------------------------------------------
// Plugin Command - Change Vehicle
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.pluginCommandVehicleInteriorsChange = function(args) {
	const vehicle = args.Vehicle;
	const map = CGMZ_Utils.parseMapParam(args.Map, "[CGMZ] Vehicle Interiors");
	const dir = Number(args.Direction);
	$cgmz.changeVehicleInterior(vehicle, map.mapId, map.x, map.y, dir);
};
//=============================================================================
// CGMZ
//-----------------------------------------------------------------------------
// Add vehicle interior to save data
//=============================================================================
//-----------------------------------------------------------------------------
// Method used by CGMZ for creating plugin data
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_createPluginData = CGMZ_Core.prototype.createPluginData;
CGMZ_Core.prototype.createPluginData = function() {
	alias_CGMZ_VehicleInteriors_createPluginData.call(this);
	this.initializeVehicleInteriors();
};
//-----------------------------------------------------------------------------
// Load new vehicle interiors with saved game
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_onAfterLoad = CGMZ_Core.prototype.onAfterLoad;
CGMZ_Core.prototype.onAfterLoad = function() {
	alias_CGMZ_VehicleInteriors_onAfterLoad.call(this);
	this.initializeVehicleInteriors();
};
//-----------------------------------------------------------------------------
// Initialize the vehicle interiors
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.initializeVehicleInteriors = function() {
	if(!this._vehicleInteriors) {
		this._vehicleInteriors = {};
		this._vehicleInteriors.boat = {mapId: CGMZ.VehicleInteriors.BoatInteriorMapInfo.mapId, x: CGMZ.VehicleInteriors.BoatInteriorMapInfo.x, y: CGMZ.VehicleInteriors.BoatInteriorMapInfo.y, dir: CGMZ.VehicleInteriors.BoatInteriorMapDir};
		this._vehicleInteriors.ship = {mapId: CGMZ.VehicleInteriors.ShipInteriorMapInfo.mapId, x: CGMZ.VehicleInteriors.ShipInteriorMapInfo.x, y: CGMZ.VehicleInteriors.ShipInteriorMapInfo.y, dir: CGMZ.VehicleInteriors.ShipInteriorMapDir};
		this._vehicleInteriors.airship = {mapId: CGMZ.VehicleInteriors.AirshipInteriorMapInfo.mapId, x: CGMZ.VehicleInteriors.AirshipInteriorMapInfo.x, y: CGMZ.VehicleInteriors.AirshipInteriorMapInfo.y, dir: CGMZ.VehicleInteriors.AirshipInteriorMapDir};
	}
};
//-----------------------------------------------------------------------------
// Change Vehicle Interior
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.changeVehicleInterior = function(vehicle, mapId, x, y, dir) {
	if(this._vehicleInteriors[vehicle]) {
		this._vehicleInteriors[vehicle].mapId = mapId;
		this._vehicleInteriors[vehicle].x = x;
		this._vehicleInteriors[vehicle].y = y;
		this._vehicleInteriors[vehicle].dir = dir;
	}
};
//-----------------------------------------------------------------------------
// Get Vehicle Interior
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.getVehicleInterior = function(vehicle) {
	return this._vehicleInteriors[vehicle];
};
//=============================================================================
// Game_Vehicle
//-----------------------------------------------------------------------------
// Modify the vehicle object for additional options
//=============================================================================
//-----------------------------------------------------------------------------
// Do not save BGM if in interior
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_getOn = Game_Vehicle.prototype.getOn;
Game_Vehicle.prototype.getOn = function() {
	if($gamePlayer.CGMZ_VehicleInteriors_isInInterior()) {
		this._driving = true;
		this.setWalkAnime(true);
		this.setStepAnime(true);
		this.playBgm();
	}
	else {
		alias_CGMZ_VehicleInteriors_getOn.call(this);
	}
};
//-----------------------------------------------------------------------------
// Do not replay BGM if in interior
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_getOff = Game_Vehicle.prototype.getOff;
Game_Vehicle.prototype.getOff = function() {
	if($gamePlayer.CGMZ_VehicleInteriors_isInInterior()) {
		this._driving = false;
		this.setWalkAnime(false);
		this.setStepAnime(false);
		this.resetDirection();
	}
    else {
		alias_CGMZ_VehicleInteriors_getOff.call(this);
	}
};
//-----------------------------------------------------------------------------
// Do not land Airship if going to interior
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_updateAirshipAltitude = Game_Vehicle.prototype.updateAirshipAltitude;
Game_Vehicle.prototype.updateAirshipAltitude = function() {
    if(!$gamePlayer.CGMZ_VehicleInteriors_isInInterior()) {
		alias_CGMZ_VehicleInteriors_updateAirshipAltitude.call(this);
	}
};
//-----------------------------------------------------------------------------
// Hide shadow if inside vehicle interior
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_shadowOpacity = Game_Vehicle.prototype.shadowOpacity;
Game_Vehicle.prototype.shadowOpacity = function() {
	if(!$gamePlayer.CGMZ_VehicleInteriors_isInInterior()) {
		return alias_CGMZ_VehicleInteriors_shadowOpacity.call(this);
	}
	return 0;
};
//-----------------------------------------------------------------------------
// Check if the vehicle has an interior
//-----------------------------------------------------------------------------
Game_Vehicle.prototype.hasInterior = function() {
	switch(this._type) {
		case "boat": return CGMZ.VehicleInteriors.BoatInteriorMapInfo.mapId > 0;
		case "ship": return CGMZ.VehicleInteriors.ShipInteriorMapInfo.mapId > 0;
		case "airship": return CGMZ.VehicleInteriors.AirshipInteriorMapInfo.mapId > 0;
	}
	return false;
};
//=============================================================================
// Game_Player
//-----------------------------------------------------------------------------
// Update to check if vehicle interior map should be called, encounters in vehicle
//=============================================================================
//-----------------------------------------------------------------------------
// Set some interior variables to defaultt values
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
    alias_CGMZ_VehicleInteriors_initMembers.call(this);
	this._CGMZ_vehicleInteriorRecall = '';
	this._CGMZ_isInInterior = false;
	this._CGMZ_vehicleRecallX = 0;
	this._CGMZ_vehicleRecallY = 0;
	this._CGMZ_vehicleRecallD = 0;
	this._CGMZ_transferringToInterior = false;
};
//-----------------------------------------------------------------------------
// Check for vehicle interior input
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_updateVehicle = Game_Player.prototype.updateVehicle;
Game_Player.prototype.updateVehicle = function() {
	alias_CGMZ_VehicleInteriors_updateVehicle.call(this);
    if(this.CGMZ_VehicleInteriors_canEnterVehicle()) {
        this.CGMZ_updateVehicleInterior(false);
    }
};
//-----------------------------------------------------------------------------
// Determine if the player is currently in a vehicle interior
//-----------------------------------------------------------------------------
Game_Player.prototype.CGMZ_VehicleInteriors_isInInterior = function() {
	return this._CGMZ_isInInterior;
};
//-----------------------------------------------------------------------------
// Determine if the player can enter a vehicle interior
//-----------------------------------------------------------------------------
Game_Player.prototype.CGMZ_VehicleInteriors_canEnterVehicle = function() {
	if(this.vehicle() && !this.vehicle().hasInterior()) return false;
	if(this._CGMZ_transferringToInterior) return false;
	if(CGMZ.VehicleInteriors.InteriorSwitch > 0 && !$gameSwitches.value(CGMZ.VehicleInteriors.InteriorSwitch)) return false;
	if(this.CGMZ_VehicleInteriors_isInInterior()) return false;
	if(!this.isInVehicle()) return false;
	if(this.areFollowersGathering()) return false;
	if(this._vehicleGettingOn) return false;
	if(this._vehicleGettingOff) return false;
	return true;
};
//-----------------------------------------------------------------------------
// Check for vehicle interior input, execute transfer if input detected
//-----------------------------------------------------------------------------
Game_Player.prototype.CGMZ_updateVehicleInterior = function(usingEventCommand) {
	const gamepad = $cgmzTemp.getLastGamepad();
    if(($cgmzTemp.isKeyPressed(CGMZ.VehicleInteriors.InteriorKey) || gamepad?.buttons[CGMZ.VehicleInteriors.GamepadButton].pressed || usingEventCommand)) {
        this._CGMZ_transferringToInterior = true;
		this._CGMZ_vehicleRecallX = this.x;
		this._CGMZ_vehicleRecallY = this.y;
		this._CGMZ_vehicleRecallD = this.direction();
		this._vehicleRecallMap = $gameMap.mapId();
		this._CGMZ_vehicleInteriorRecall = this.CGMZ_getVehicleInteriorRecallType();
		const vehicleInteriorData = $cgmz.getVehicleInterior(this._CGMZ_vehicleInteriorRecall);
		const mapId = vehicleInteriorData.mapId;
		const x = vehicleInteriorData.x;
		const y = vehicleInteriorData.y;
		const dir = vehicleInteriorData.dir;
		this._CGMZ_isInInterior = true;
		this._vehicleGettingOff = true;
		this.vehicle().getOff();
		this.setMoveSpeed(4);
        this.setThrough(false);
		this.reserveTransfer(mapId, x, y, dir, 0);
		this._CGMZ_transferringToInterior = false;
    }
};
//-----------------------------------------------------------------------------
// Check for vehicle interior input, execute transfer if input detected
//-----------------------------------------------------------------------------
Game_Player.prototype.CGMZ_getVehicleInteriorRecallType = function() {
	if(this.isInBoat()) return 'boat';
	if(this.isInShip()) return 'ship';
	if(this.isInAirship()) return 'airship';
	return 'walk';
};
//-----------------------------------------------------------------------------
// Force Enter Interior of Vehicle
//-----------------------------------------------------------------------------
Game_Player.prototype.CGMZ_forceVehicleInteriorEnter = function() {
	if(this.CGMZ_VehicleInteriors_canEnterVehicle()) {
		this.CGMZ_updateVehicleInterior(true);
	}
};
//-----------------------------------------------------------------------------
// Exit Interior of Vehicle
//-----------------------------------------------------------------------------
Game_Player.prototype.CGMZ_vehicleInteriorExit = function() {
	if(this._CGMZ_isInInterior) {
		this.gatherFollowers();
		this._vehicleType = this._CGMZ_vehicleInteriorRecall;
		const x  = this._CGMZ_vehicleRecallX;
		const y  = this._CGMZ_vehicleRecallY;
		const dir = this._CGMZ_vehicleRecallD;
		const mapId = this._vehicleRecallMap;
		this._vehicleGettingOn = true;
		this.reserveTransfer(mapId, x, y, dir, 0);
	}
};
//-----------------------------------------------------------------------------
// Clear vehicle interior flag only after vehicle is boarded
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_updateVehicleGetOn = Game_Player.prototype.updateVehicleGetOn;
Game_Player.prototype.updateVehicleGetOn = function() {
	alias_CGMZ_VehicleInteriors_updateVehicleGetOn.call(this);
    if (!this.areFollowersGathering() && !this.isMoving()) {
        this._CGMZ_isInInterior = false;
    }
	this.makeEncounterCount();
};
//-----------------------------------------------------------------------------
// No need for checking altitude for airship interior
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_updateVehicleGetOff = Game_Player.prototype.updateVehicleGetOff;
Game_Player.prototype.updateVehicleGetOff = function() {
	if(this.CGMZ_VehicleInteriors_isInInterior()) {
		this._vehicleGettingOff = false;
        this._vehicleType = 'walk';
	}
    else {
		alias_CGMZ_VehicleInteriors_updateVehicleGetOff.call(this);
	}
	this.makeEncounterCount();
};
//-----------------------------------------------------------------------------
// Set transparency after transfer to vehicle interior
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function() {
    alias_CGMZ_VehicleInteriors_performTransfer.call(this);
	if(this.CGMZ_VehicleInteriors_isInInterior()) {
		this.setTransparent(false);
	}
};
//=============================================================================
// Scene_Map
//-----------------------------------------------------------------------------
// Also add vehicle interior touch UI + handling
//=============================================================================
//-----------------------------------------------------------------------------
// Also create vehicle interior button if touch UI
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_SceneMap_createButtons = Scene_Map.prototype.createButtons;
Scene_Map.prototype.createButtons = function() {
	alias_CGMZ_VehicleInteriors_SceneMap_createButtons.call(this);
    if (ConfigManager.touchUI) {
        this.CGMZ_VehicleInteriors_createVehicleInteriorButton();
    }
};
//-----------------------------------------------------------------------------
// Create the vehicle interior button
//-----------------------------------------------------------------------------
Scene_Map.prototype.CGMZ_VehicleInteriors_createVehicleInteriorButton = function() {
	this._CGMZ_vehicleInteriorButton = new Sprite_Button("cgmzVehicleInterior");
    this._CGMZ_vehicleInteriorButton.x = Graphics.boxWidth - (this._CGMZ_vehicleInteriorButton.width + 4) * 2;
    this._CGMZ_vehicleInteriorButton.y = this.buttonY();
    this._CGMZ_vehicleInteriorButton.visible = false;
	this._CGMZ_vehicleInteriorButton.setClickHandler(this.CGMZ_VehicleInteriorButtonOnClick);
    this.addWindow(this._CGMZ_vehicleInteriorButton);
};
//-----------------------------------------------------------------------------
// Vehicle Interior Button click handler method
//-----------------------------------------------------------------------------
Scene_Map.prototype.CGMZ_VehicleInteriorButtonOnClick = function() {
	$gamePlayer.CGMZ_forceVehicleInteriorEnter();
};
//-----------------------------------------------------------------------------
// Vehicle interior button might be touched
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_SceneMap_isAnyButtonPressed = Scene_Map.prototype.isAnyButtonPressed;
Scene_Map.prototype.isAnyButtonPressed = function() {
    return alias_CGMZ_VehicleInteriors_SceneMap_isAnyButtonPressed.call(this) || (this._CGMZ_vehicleInteriorButton && this._CGMZ_vehicleInteriorButton.isPressed());
};
//-----------------------------------------------------------------------------
// Also update vehicle interior button
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_SceneMap_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    alias_CGMZ_VehicleInteriors_SceneMap_update.call(this);
	this.CGMZ_updateVehicleInteriorButton();
};
//-----------------------------------------------------------------------------
// Update vehicle interior button
//-----------------------------------------------------------------------------
Scene_Map.prototype.CGMZ_updateVehicleInteriorButton = function() {
    if (this._CGMZ_vehicleInteriorButton) {
        const buttonEnabled = this.CGMZ_isVehicleInteriorButtonEnabled();
        if (buttonEnabled !== this._CGMZ_vehicleInteriorButton.visible) {
            this._CGMZ_vehicleInteriorButton.visible = buttonEnabled;
        }
    }
};
//-----------------------------------------------------------------------------
// Check if vehicle interior button should display
//-----------------------------------------------------------------------------
Scene_Map.prototype.CGMZ_isVehicleInteriorButtonEnabled = function() {
    return this._CGMZ_vehicleInteriorButton && !$gameMap.isEventRunning() && $gamePlayer.CGMZ_VehicleInteriors_canEnterVehicle();
};
//-----------------------------------------------------------------------------
// Also hide vehicle interior button if not battle scene next
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_SceneMap_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function() {
	this.CGMZ_hideVehicleInteriorButton();
    alias_CGMZ_VehicleInteriors_SceneMap_terminate.call(this);
};
//-----------------------------------------------------------------------------
// Hide the vehicle interior button
//-----------------------------------------------------------------------------
Scene_Map.prototype.CGMZ_hideVehicleInteriorButton = function() {
    if(this._CGMZ_vehicleInteriorButton) {
        this._CGMZ_vehicleInteriorButton.visible = false;
    }
};
//=============================================================================
// Sprite_Button
//-----------------------------------------------------------------------------
// Add vehicle interior button
//=============================================================================
//-----------------------------------------------------------------------------
// If undefined, check if vehicle interior button and return expected results
//-----------------------------------------------------------------------------
const alias_CGMZ_VehicleInteriors_SpriteButton_buttonData = Sprite_Button.prototype.buttonData;
Sprite_Button.prototype.buttonData = function() {
    const data = alias_CGMZ_VehicleInteriors_SpriteButton_buttonData.call(this);
	if(data) return data;
	const vehicleInteriorButtonTable = {
		cgmzVehicleInterior: { x: CGMZ.VehicleInteriors.InteriorButtonOffset, w: CGMZ.VehicleInteriors.InteriorButtonWidth }
	};
	return vehicleInteriorButtonTable[this._buttonType];
};