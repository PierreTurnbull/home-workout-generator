"""
Build a simple human mannequin with pushup, squat, and bear-walk animations.
Body parts are bone-parented meshes. Body orientation uses armature object transforms;
limb articulation uses pose bones. Actions get fake users so they persist.
"""
from __future__ import annotations

import math
from pathlib import Path

import bpy
from mathutils import Euler, Vector

ROOT = Path(__file__).resolve().parent
BLEND_PATH = ROOT / "workout_human.blend"
RENDER_ROOT = ROOT / "renders"
EXPORT_ROOT = ROOT / "exports"

FPS = 24
RES = 640
ANIM_FRAMES = 48

PART_BONE = {
    "Head": "Head",
    "NeckMesh": "Neck",
    "Torso": "Chest",
    "Pelvis": "Root",
    "UpperArm.L": "UpperArm.L",
    "ForeArm.L": "ForeArm.L",
    "Hand.L": "Hand.L",
    "UpperArm.R": "UpperArm.R",
    "ForeArm.R": "ForeArm.R",
    "Hand.R": "Hand.R",
    "Thigh.L": "Thigh.L",
    "Shin.L": "Shin.L",
    "Foot.L": "Foot.L",
    "Thigh.R": "Thigh.R",
    "Shin.R": "Shin.R",
    "Foot.R": "Foot.R",
}


def clear_scene() -> None:
    if bpy.context.object and getattr(bpy.context.object, "mode", "OBJECT") != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (
        bpy.data.meshes,
        bpy.data.armatures,
        bpy.data.materials,
        bpy.data.actions,
        bpy.data.cameras,
        bpy.data.lights,
        bpy.data.images,
        bpy.data.curves,
    ):
        for block in list(datablocks):
            datablocks.remove(block)


def setup_world_and_render() -> None:
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.fps = FPS
    scene.render.resolution_x = RES
    scene.render.resolution_y = RES
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    scene.frame_start = 1
    scene.frame_end = ANIM_FRAMES

    world = bpy.data.worlds.new("WorkoutWorld")
    scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Color"].default_value = (0.78, 0.82, 0.86, 1.0)
    bg.inputs["Strength"].default_value = 0.7
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])


def make_material(name: str, color, roughness: float = 0.45) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        if "Roughness" in bsdf.inputs:
            bsdf.inputs["Roughness"].default_value = roughness
    return mat


def create_ground(mat: bpy.types.Material) -> bpy.types.Object:
    bpy.ops.mesh.primitive_plane_add(size=14, location=(0, 0, 0))
    ground = bpy.context.active_object
    ground.name = "Ground"
    ground.data.materials.append(mat)
    return ground


def create_armature() -> bpy.types.Object:
    arm_data = bpy.data.armatures.new("HumanArmature")
    arm_obj = bpy.data.objects.new("HumanArmature", arm_data)
    bpy.context.collection.objects.link(arm_obj)
    bpy.context.view_layer.objects.active = arm_obj
    arm_obj.select_set(True)

    bpy.ops.object.mode_set(mode="EDIT")
    eb = arm_data.edit_bones

    def bone(name, head, tip, parent=None):
        b = eb.new(name)
        b.head = Vector(head)
        b.tail = Vector(tip)
        b.use_connect = False
        if parent:
            b.parent = eb[parent]
        return b

    bone("Root", (0, 0, 0.95), (0, 0, 1.05))
    bone("Spine", (0, 0, 1.05), (0, 0, 1.28), "Root")
    bone("Chest", (0, 0, 1.28), (0, 0, 1.50), "Spine")
    bone("Neck", (0, 0, 1.50), (0, 0, 1.58), "Chest")
    bone("Head", (0, 0, 1.58), (0, 0, 1.78), "Neck")

    bone("Shoulder.L", (0.06, 0, 1.48), (0.20, 0, 1.48), "Chest")
    bone("UpperArm.L", (0.20, 0, 1.48), (0.20, 0, 1.18), "Shoulder.L")
    bone("ForeArm.L", (0.20, 0, 1.18), (0.20, 0, 0.92), "UpperArm.L")
    bone("Hand.L", (0.20, 0, 0.92), (0.20, 0, 0.80), "ForeArm.L")

    bone("Shoulder.R", (-0.06, 0, 1.48), (-0.20, 0, 1.48), "Chest")
    bone("UpperArm.R", (-0.20, 0, 1.48), (-0.20, 0, 1.18), "Shoulder.R")
    bone("ForeArm.R", (-0.20, 0, 1.18), (-0.20, 0, 0.92), "UpperArm.R")
    bone("Hand.R", (-0.20, 0, 0.92), (-0.20, 0, 0.80), "ForeArm.R")

    bone("Thigh.L", (0.10, 0, 0.95), (0.10, 0, 0.52), "Root")
    bone("Shin.L", (0.10, 0, 0.52), (0.10, 0, 0.10), "Thigh.L")
    bone("Foot.L", (0.10, 0, 0.10), (0.10, 0.18, 0.04), "Shin.L")

    bone("Thigh.R", (-0.10, 0, 0.95), (-0.10, 0, 0.52), "Root")
    bone("Shin.R", (-0.10, 0, 0.52), (-0.10, 0, 0.10), "Thigh.R")
    bone("Foot.R", (-0.10, 0, 0.10), (-0.10, 0.18, 0.04), "Shin.R")

    bpy.ops.object.mode_set(mode="OBJECT")
    return arm_obj


def _add_part(name, kind, loc, dims, mat):
    if kind == "cube":
        bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
        obj = bpy.context.active_object
        obj.scale = (dims[0] / 2, dims[1] / 2, dims[2] / 2)
    elif kind == "cylinder":
        bpy.ops.mesh.primitive_cylinder_add(radius=dims[0], depth=dims[1], location=loc, vertices=16)
        obj = bpy.context.active_object
    elif kind == "sphere":
        bpy.ops.mesh.primitive_uv_sphere_add(radius=dims, location=loc, segments=16, ring_count=8)
        obj = bpy.context.active_object
    else:
        raise ValueError(kind)
    obj.name = name
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    return obj


def create_body_parts(skin, shirt) -> list[bpy.types.Object]:
    specs = [
        ("Head", "sphere", (0, 0, 1.70), 0.12, skin),
        ("NeckMesh", "cylinder", (0, 0, 1.54), (0.05, 0.08), skin),
        ("Torso", "cube", (0, 0, 1.28), (0.36, 0.22, 0.46), shirt),
        ("Pelvis", "cube", (0, 0, 0.98), (0.30, 0.20, 0.16), skin),
        ("UpperArm.L", "cylinder", (0.20, 0, 1.33), (0.05, 0.30), skin),
        ("ForeArm.L", "cylinder", (0.20, 0, 1.05), (0.04, 0.26), skin),
        ("Hand.L", "cube", (0.20, 0, 0.86), (0.08, 0.05, 0.10), skin),
        ("UpperArm.R", "cylinder", (-0.20, 0, 1.33), (0.05, 0.30), skin),
        ("ForeArm.R", "cylinder", (-0.20, 0, 1.05), (0.04, 0.26), skin),
        ("Hand.R", "cube", (-0.20, 0, 0.86), (0.08, 0.05, 0.10), skin),
        ("Thigh.L", "cylinder", (0.10, 0, 0.735), (0.06, 0.42), skin),
        ("Shin.L", "cylinder", (0.10, 0, 0.31), (0.05, 0.40), skin),
        ("Foot.L", "cube", (0.10, 0.06, 0.04), (0.10, 0.22, 0.06), skin),
        ("Thigh.R", "cylinder", (-0.10, 0, 0.735), (0.06, 0.42), skin),
        ("Shin.R", "cylinder", (-0.10, 0, 0.31), (0.05, 0.40), skin),
        ("Foot.R", "cube", (-0.10, 0.06, 0.04), (0.10, 0.22, 0.06), skin),
    ]
    return [_add_part(*s) for s in specs]


def parent_parts_to_bones(arm_obj: bpy.types.Object, parts: list[bpy.types.Object]) -> None:
    bpy.context.view_layer.update()
    for part in parts:
        mw = part.matrix_world.copy()
        part.parent = arm_obj
        part.parent_type = "BONE"
        part.parent_bone = PART_BONE[part.name]
        part.matrix_world = mw
    bpy.context.view_layer.update()


def set_rot(pb, xyz_deg, frame: int) -> None:
    pb.rotation_mode = "XYZ"
    pb.rotation_euler = Euler(tuple(math.radians(a) for a in xyz_deg), "XYZ")
    pb.keyframe_insert(data_path="rotation_euler", frame=frame)


def set_loc(pb, loc, frame: int) -> None:
    pb.location = Vector(loc)
    pb.keyframe_insert(data_path="location", frame=frame)


def set_arm_xform(arm_obj, loc, rot_deg, frame: int) -> None:
    arm_obj.location = Vector(loc)
    arm_obj.rotation_mode = "XYZ"
    arm_obj.rotation_euler = Euler(tuple(math.radians(a) for a in rot_deg), "XYZ")
    arm_obj.keyframe_insert(data_path="location", frame=frame)
    arm_obj.keyframe_insert(data_path="rotation_euler", frame=frame)


def make_action(arm_obj: bpy.types.Object, name: str) -> bpy.types.Action:
    action = bpy.data.actions.new(name)
    action.use_fake_user = True
    if arm_obj.animation_data is None:
        arm_obj.animation_data_create()
    arm_obj.animation_data.action = action
    return action


def smooth_action(action: bpy.types.Action) -> None:
    fcurves = []
    if hasattr(action, "fcurves") and action.fcurves:
        fcurves = list(action.fcurves)
    else:
        for layer in action.layers:
            for strip in layer.strips:
                for bag in getattr(strip, "channelbags", []):
                    fcurves.extend(list(bag.fcurves))
    for fcurve in fcurves:
        for kp in fcurve.keyframe_points:
            kp.interpolation = "BEZIER"
            kp.handle_left_type = "AUTO_CLAMPED"
            kp.handle_right_type = "AUTO_CLAMPED"


def zero_pose(pb, frame: int, bones=None) -> None:
    names = bones or [b.name for b in pb]
    for name in names:
        set_rot(pb[name], (0, 0, 0), frame)
        set_loc(pb[name], (0, 0, 0), frame)


def create_pushup_action(arm_obj: bpy.types.Object) -> bpy.types.Action:
    """Side-view plank via Root pitch; elbows bend for the down phase."""
    action = make_action(arm_obj, "Pushup")
    pb = arm_obj.pose.bones

    def pose(kind: str, frame: int):
        set_arm_xform(arm_obj, (0, 0, 0), (0, 0, 0), frame)
        zero_pose(pb, frame)

        # After Root Rx=90, local Y lowers world Z. Tuned so hands ~floor, chest elevated.
        drop = 0.14 if kind == "down" else 0.0
        set_loc(pb["Root"], (0.0, -0.55 - drop, 0.0), frame)
        set_rot(pb["Root"], (90, 0, 0), frame)
        set_rot(pb["Neck"], (-12, 0, 0), frame)
        set_rot(pb["Head"], (-5, 0, 0), frame)
        set_rot(pb["Foot.L"], (-90, 0, 0), frame)
        set_rot(pb["Foot.R"], (-90, 0, 0), frame)

        if kind == "up":
            set_rot(pb["UpperArm.L"], (-30, 0, 0), frame)
            set_rot(pb["UpperArm.R"], (-30, 0, 0), frame)
            set_rot(pb["ForeArm.L"], (-10, 0, 0), frame)
            set_rot(pb["ForeArm.R"], (-10, 0, 0), frame)
        else:
            set_rot(pb["Chest"], (6, 0, 0), frame)
            set_rot(pb["UpperArm.L"], (-12, 0, 0), frame)
            set_rot(pb["UpperArm.R"], (-12, 0, 0), frame)
            set_rot(pb["ForeArm.L"], (-70, 0, 0), frame)
            set_rot(pb["ForeArm.R"], (-70, 0, 0), frame)

    for f, kind in ((1, "up"), (12, "up"), (24, "down"), (36, "up"), (48, "up")):
        pose(kind, f)

    smooth_action(action)
    return action


def create_squat_action(arm_obj: bpy.types.Object) -> bpy.types.Action:
    action = make_action(arm_obj, "Squat")
    pb = arm_obj.pose.bones

    def pose(kind: str, frame: int):
        set_arm_xform(arm_obj, (0, 0, 0), (0, 0, 0), frame)
        zero_pose(pb, frame)

        if kind == "stand":
            for side, s in (("L", 1), ("R", -1)):
                set_rot(pb[f"UpperArm.{side}"], (-18, 0, 10 * s), frame)
                set_rot(pb[f"ForeArm.{side}"], (-8, 0, 0), frame)
        else:
            set_loc(pb["Root"], (0, 0.04, -0.42), frame)
            set_rot(pb["Root"], (6, 0, 0), frame)
            set_rot(pb["Spine"], (10, 0, 0), frame)
            set_rot(pb["Chest"], (5, 0, 0), frame)
            set_rot(pb["Neck"], (-6, 0, 0), frame)
            for side, s in (("L", 1), ("R", -1)):
                set_rot(pb[f"UpperArm.{side}"], (-50, 0, 8 * s), frame)
                set_rot(pb[f"ForeArm.{side}"], (-12, 0, 0), frame)
                set_rot(pb[f"Thigh.{side}"], (-95, 0, 8 * s), frame)
                set_rot(pb[f"Shin.{side}"], (100, 0, 0), frame)
                set_rot(pb[f"Foot.{side}"], (-8, 0, 0), frame)

    for f, kind in ((1, "stand"), (10, "stand"), (24, "squat"), (38, "stand"), (48, "stand")):
        pose(kind, f)

    smooth_action(action)
    return action


def create_bear_walk_action(arm_obj: bpy.types.Object) -> bpy.types.Action:
    """All-fours crawl with hips up; contralateral limb cycle + forward travel."""
    action = make_action(arm_obj, "BearWalk")
    pb = arm_obj.pose.bones

    def pose(phase: str, frame: int, travel: float):
        set_arm_xform(arm_obj, (0, travel, 0), (0, 0, 0), frame)
        zero_pose(pb, frame)

        set_loc(pb["Root"], (0.0, -0.50, 0.0), frame)
        set_rot(pb["Root"], (80, 0, 0), frame)
        set_rot(pb["Neck"], (-20, 0, 0), frame)
        set_rot(pb["Head"], (-8, 0, 0), frame)
        set_rot(pb["Spine"], (5, 0, 0), frame)

        # Base plant: hands and feet near floor, hips elevated
        if phase == "mid":
            ua = (-35, -35)
            fa = (-15, -15)
            th = (-50, -50)
            sh = (70, 70)
        elif phase == "a":
            # L hand forward / R hand back; R foot forward / L foot back
            ua = (-50, -20)
            fa = (-10, -25)
            th = (-35, -65)
            sh = (55, 80)
        else:
            ua = (-20, -50)
            fa = (-25, -10)
            th = (-65, -35)
            sh = (80, 55)

        set_rot(pb["UpperArm.L"], (ua[0], 0, 0), frame)
        set_rot(pb["UpperArm.R"], (ua[1], 0, 0), frame)
        set_rot(pb["ForeArm.L"], (fa[0], 0, 0), frame)
        set_rot(pb["ForeArm.R"], (fa[1], 0, 0), frame)
        set_rot(pb["Thigh.L"], (th[0], 0, 0), frame)
        set_rot(pb["Thigh.R"], (th[1], 0, 0), frame)
        set_rot(pb["Shin.L"], (sh[0], 0, 0), frame)
        set_rot(pb["Shin.R"], (sh[1], 0, 0), frame)
        set_rot(pb["Foot.L"], (-60, 0, 0), frame)
        set_rot(pb["Foot.R"], (-60, 0, 0), frame)

    for f, phase, travel in (
        (1, "mid", -0.4),
        (12, "a", -0.1),
        (24, "mid", 0.2),
        (36, "b", 0.5),
        (48, "mid", 0.8),
    ):
        pose(phase, f, travel)

    smooth_action(action)
    return action


def setup_lighting() -> None:
    def add_light(name, typ, loc, energy, color=(1, 0.98, 0.95), size=2.0):
        data = bpy.data.lights.new(name=name, type=typ)
        data.energy = energy
        data.color = color
        if typ == "AREA":
            data.size = size
        obj = bpy.data.objects.new(name, data)
        bpy.context.collection.objects.link(obj)
        obj.location = loc
        direction = Vector((0, 0.2, 0.8)) - Vector(loc)
        obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

    add_light("KeyLight", "AREA", (2.8, -2.2, 3.4), 280, size=2.4)
    add_light("FillLight", "AREA", (-3.0, -1.4, 2.4), 90, color=(0.85, 0.90, 1.0), size=2.8)
    add_light("RimLight", "AREA", (0.4, 3.2, 2.6), 140, color=(1.0, 0.95, 0.9), size=2.0)


def create_cameras() -> dict[str, bpy.types.Object]:
    cams = {}

    def cam(name, loc, look_at, lens=50):
        data = bpy.data.cameras.new(name)
        data.lens = lens
        obj = bpy.data.objects.new(name, data)
        bpy.context.collection.objects.link(obj)
        obj.location = loc
        direction = Vector(look_at) - Vector(loc)
        obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        cams[name] = obj
        return obj

    # Same lighting; framing chosen per exercise
    cam("Camera_Pushup", (3.2, 0.2, 0.55), (0.0, 0.2, 0.30), lens=50)
    cam("Camera_Squat", (2.5, -2.9, 1.55), (0.0, 0.0, 0.85), lens=50)
    cam("Camera_BearWalk", (3.3, -1.6, 1.35), (0.0, 0.2, 0.45), lens=45)
    return cams


def render_action(scene, arm_obj, action, camera, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    for old in out_dir.glob("frame_*.png"):
        old.unlink()
    arm_obj.animation_data.action = action
    scene.camera = camera
    scene.frame_start = 1
    scene.frame_end = ANIM_FRAMES
    scene.render.filepath = str(out_dir / "frame_")
    bpy.ops.render.render(animation=True)


def main() -> None:
    RENDER_ROOT.mkdir(parents=True, exist_ok=True)
    EXPORT_ROOT.mkdir(parents=True, exist_ok=True)

    clear_scene()
    setup_world_and_render()

    skin = make_material("Skin", (0.90, 0.74, 0.62, 1.0), 0.55)
    shirt = make_material("Shirt", (0.16, 0.40, 0.52, 1.0), 0.5)
    ground_mat = make_material("Floor", (0.52, 0.55, 0.58, 1.0), 0.9)

    create_ground(ground_mat)
    arm = create_armature()
    parts = create_body_parts(skin, shirt)
    parent_parts_to_bones(arm, parts)

    setup_lighting()
    cameras = create_cameras()

    actions = {
        "Pushup": create_pushup_action(arm),
        "Squat": create_squat_action(arm),
        "BearWalk": create_bear_walk_action(arm),
    }
    for a in actions.values():
        a.use_fake_user = True

    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))

    scene = bpy.context.scene
    for name, action, cam in (
        ("Pushup", actions["Pushup"], cameras["Camera_Pushup"]),
        ("Squat", actions["Squat"], cameras["Camera_Squat"]),
        ("BearWalk", actions["BearWalk"], cameras["Camera_BearWalk"]),
    ):
        print(f"Rendering {name}...")
        render_action(scene, arm, action, cam, RENDER_ROOT / name.lower())

    arm.animation_data.action = actions["Squat"]
    scene.camera = cameras["Camera_Squat"]
    bpy.ops.wm.save_mainfile()
    print("DONE")
    print(f"BLEND={BLEND_PATH}")
    print(f"ACTIONS={[a.name for a in bpy.data.actions]}")


if __name__ == "__main__":
    main()
